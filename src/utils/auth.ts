const encoder = new TextEncoder()

export async function hashSenha(senha: string): Promise<string> {
  const data = encoder.encode(senha)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  const bytes = Array.from(new Uint8Array(buffer))
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return (await hashSenha(senha)) === hash
}