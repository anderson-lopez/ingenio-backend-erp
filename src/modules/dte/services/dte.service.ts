import {
  Injectable,
  Logger,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

@Injectable()
export class DteService {
  private readonly logger = new Logger(DteService.name);

  private readonly authUrl =
    'https://apitest.dtes.mh.gob.sv/seguridad/auth';
  private readonly signUrl =
    'http://34.55.162.123:8014/firmardocumento/';
  private readonly sendUrl =
    'http://34.55.162.123:8012/appsigner/firmSendMh/';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  /* ─────────────── 1.  TOKEN con caché (24 h) ─────────────── */
  private async getValidToken(): Promise<string> {
    this.logger.log('🔍 Buscando token en caché…');
    const cached = await this.cache.get<{
      token: string;
      exp: number;
    }>('hacienda_token');
  
    const nowSec = Math.floor(Date.now() / 1000);
  
    if (cached && cached.exp - nowSec > 300) {
      this.logger.log('✅ Token válido encontrado en caché.');
      return cached.token;
    }
  
    this.logger.warn('⚠️ Token no encontrado o vencido. Solicitando nuevo…');
  
    const user = this.config.get<string>('HACIENDA_USER')!.trim();
    const pwd = this.config.get<string>('HACIENDA_PWD')!.trim();
  
    const body = new URLSearchParams();
    body.append('user', user);
    body.append('pwd', pwd);
  
    this.logger.debug('🚀 Body que se enviará:', body.toString());

    // 1️⃣ Muestra el URL destino
    this.logger.debug('🔗 URL destino:', this.authUrl);

    // 2️⃣ Muestra el método
    this.logger.debug('📝 Método: POST');

    // 3️⃣ Muestra los headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'curl/7.81.0', // Igual a Postman/cURL
    };
    this.logger.debug('📄 Headers:', JSON.stringify(headers, null, 2));

    // 4️⃣ Muestra el cuerpo final (en string)
    const finalBody = body.toString();
    this.logger.debug('📦 Body (string):', finalBody);

    // 5️⃣ Opcional: muestra la estructura de cada parte
    this.logger.debug('🔍 Estructura BODY como objeto:', {
      user,
      pwd,
    });
      
    try {
      const response = await fetch(this.authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'curl/7.81.0', // 💡 Igual a Postman/cURL
        },
        body: body.toString(),
      });
    
      this.logger.verbose(`🔑 Respuesta status: ${response.status}`);
    
      const text = await response.text();
      this.logger.verbose('🔎 Respuesta cruda:', text);
    
      let data: { status: string; body?: { user: string; token: string } };
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        this.logger.error('❌ La respuesta no es JSON. Contenido HTML u otro:', text);
        throw new Error(`Respuesta no válida de Hacienda: ${text}`);
      }
    
      if (!response.ok) {
        const errMsg = `❌ Error al solicitar token. Status: ${response.status} ${response.statusText}`;
        this.logger.error(errMsg, data);
        throw new Error(errMsg);
      }
    
      const fullToken = data?.body?.token as string;
      if (!fullToken) {
        this.logger.error('❌ Token no recibido. Respuesta:', data);
        throw new Error('Token no recibido de Hacienda');
      }
    
      const rawJwt = fullToken.replace(/^Bearer\s+/i, '');
      const payload = jwt.decode(rawJwt) as { exp: number } | null;
      if (!payload || !payload.exp) {
        throw new Error('No se pudo decodificar el token JWT');
      }
      const { exp } = payload;
    
      const ttl = exp - nowSec;
      await this.cache.set('hacienda_token', { token: fullToken, exp }, ttl);
    
      this.logger.log(
        `✅ Token nuevo almacenado (${Math.floor(ttl / 3600)} h restantes)`,
      );
      return fullToken;
    } catch (err) {
      this.logger.error('❌ Error en el proceso de solicitud de token:', err);
      throw err;
    }
    
  }
  
  

  /* ─────────────── 2.  FIRMA  ─────────────── */
  async signDocument(dte: any) {
    this.logger.log('✏️ Solicitando firma de DTE…');
    this.logger.debug('📄 DTE:', JSON.stringify(dte));

    try {
      const { data } = await firstValueFrom(
        this.http.post(this.signUrl, dte, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      this.logger.log('✅ DTE firmado correctamente.');
      this.logger.verbose('🔐 DTE firmado:', JSON.stringify(data));

      return data;
    } catch (err) {
      this.logger.error('❌ Error al firmar DTE:', err);
      throw err;
    }
  }

  /* ─────────────── 3.  ENVÍO  ─────────────── */
  async sendToHacienda(signedDte: any) {
    this.logger.log('🚀 Enviando DTE firmado a Hacienda…');
    this.logger.debug('📄 DTE firmado:', JSON.stringify(signedDte));

    try {
      const token = await this.getValidToken();

      const { data } = await firstValueFrom(
        this.http.post(this.sendUrl, signedDte, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }),
      );

      this.logger.log('✅ Respuesta de Hacienda recibida.');
      this.logger.verbose('📦 Respuesta Hacienda:', JSON.stringify(data));

      return data;
    } catch (err) {
      this.logger.error('❌ Error al enviar a Hacienda:', err);
      throw err;
    }
  }

  /** Método público para obtener (o renovar) el token manualmente */
  public async fetchToken(): Promise<string> {
    return this.getValidToken();   // reutiliza la lógica de caché interna
  }

  // services/dte.service.ts
  async sendDteDirectly(dte: any) {
    this.logger.log('🚀 Iniciando envío directo de DTE a Hacienda…');
  
    try {
      // 🔑 Obtén el token válido (lo refresca si está vencido)
      const token = await this.getValidToken();
  
      // 📦 Construir el cuerpo de la solicitud
      const requestBody = {
        token,
        usuario: this.config.get<string>('HACIENDA_USER'),
        emisor_id: 1, // Ajusta este valor según corresponda en tu sistema
        tipo_dte: '14', // Ejemplo: Factura (01), Nota de crédito (03), etc.
        dte_json: JSON.stringify(dte), // 🔥 Ojo: debe ser un string JSON, no objeto
      };
  
      this.logger.debug('🔎 Enviando requestBody a Hacienda:', JSON.stringify(requestBody));
  
      // 🚀 Hacer la petición POST directamente a Hacienda
      const response = await firstValueFrom(
        this.http.post(this.sendUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Ingenio360-DTE/1.0',
          },
        }),
      );
  
      this.logger.log('✅ DTE enviado directamente a Hacienda.');
      this.logger.verbose('📦 Respuesta de Hacienda:', JSON.stringify(response.data));
  
      return response.data;
    } catch (err) {
      this.logger.error('❌ Error al enviar DTE directo a Hacienda:', err);
      throw err;
    }
  }
  



}
