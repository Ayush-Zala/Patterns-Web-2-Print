import { SystemApi } from './modules/system';
import { ProductsApi } from './modules/products';
import { WorkspaceApi } from './modules/workspace';
import { AuthApi } from './modules/auth';
import { TemplateApi } from './modules/templates';

export interface ApiClientOptions {
  baseUrl: string;
  token?: string;
}

export class ApiClient {
  public system: SystemApi;
  public products: ProductsApi;
  public workspace: WorkspaceApi;
  public auth: AuthApi;
  public templates: TemplateApi;

  constructor(private readonly options: ApiClientOptions) {
    this.system = new SystemApi(this);
    this.products = new ProductsApi(this);
    this.workspace = new WorkspaceApi(this);
    this.auth = new AuthApi(this);
    this.templates = new TemplateApi(this);
  }

  public async fetch<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.options.baseUrl}${path}`;
    const headers = new Headers(init?.headers);

    if (this.options.token) {
      headers.set('Authorization', `Bearer ${this.options.token}`);
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...init, headers });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  public setToken(token: string) {
    this.options.token = token;
  }
}
