# Supabase Storage Setup Guide

Este guia explica como configurar o Supabase Storage para permitir upload de avatares de usuários.

## 1. Configuração do Bucket

### Criar o Bucket
1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá para **Storage** no menu lateral
3. Clique em **New bucket**
4. Configure o bucket:
   - **Name**: `avatars`
   - **Public**: ✅ (marcado para permitir acesso público às imagens)
   - **File size limit**: `5MB` (ou conforme necessário)
   - **Allowed MIME types**: `image/*`

### Configurar Políticas de Segurança (RLS)

1. Vá para **Storage** > **Policies**
2. Clique em **New Policy** para o bucket `avatars`

#### Política de Upload (INSERT)
```sql
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Política de Visualização (SELECT)
```sql
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

#### Política de Atualização (UPDATE)
```sql
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Política de Exclusão (DELETE)
```sql
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 2. Estrutura de Arquivos

O sistema organiza os avatares da seguinte forma:
```
avatars/
├── {user_id}-{timestamp}.jpg
├── {user_id}-{timestamp}.png
└── ...
```

## 3. Configuração de CORS (Opcional)

Se você encontrar problemas de CORS, configure no Supabase Dashboard:

1. Vá para **Settings** > **API**
2. Na seção **CORS**, adicione:
   - `http://localhost:3000` (desenvolvimento)
   - `https://yourdomain.com` (produção)

## 4. Testando a Configuração

Após configurar, teste o upload de avatar na página de configurações:

1. Faça login na aplicação
2. Vá para **Settings**
3. Clique em **Edit** na seção de informações pessoais
4. Teste o upload de uma imagem
5. Verifique se a imagem aparece corretamente

## 5. Troubleshooting

### Erro: "Bucket not found"
- Verifique se o bucket `avatars` foi criado
- Confirme se o nome está correto (case-sensitive)

### Erro: "Permission denied"
- Verifique se as políticas RLS estão configuradas corretamente
- Confirme se o usuário está autenticado

### Erro: "File too large"
- Verifique o limite de tamanho do bucket
- Confirme se o arquivo não excede 5MB

### Erro: "Invalid file type"
- Verifique se o arquivo é uma imagem válida
- Confirme se o MIME type está correto

## 6. Monitoramento

Para monitorar o uso do storage:

1. Vá para **Storage** > **Usage**
2. Monitore o uso de espaço e número de arquivos
3. Configure alertas se necessário

## 7. Backup e Limpeza

### Backup
- O Supabase faz backup automático dos arquivos
- Para backup manual, use a API ou exporte via dashboard

### Limpeza
- Configure uma política para limpar avatares antigos
- Monitore o uso de storage regularmente
- Considere implementar compressão de imagens
