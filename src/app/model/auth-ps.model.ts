import { Usuario } from './usuario.model';
import { Permissao } from './permissao.model';

export declare class AuthPsModel {
  id?: number
  user?: Usuario
  email?: string | null
  password?: string | null
  tokenAccess?: string | null
  authUid?: string
  typeRule?: string
  permissoes?: Permissao[]
}
