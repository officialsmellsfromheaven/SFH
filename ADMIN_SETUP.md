# Admin order management setup

Set these server-only environment variables before using `/admin/orders`:

```env
ADMIN_EMAILS=admin@example.com
ADMIN_ACCESS_KEY=use-a-long-random-secret
```

`ADMIN_EMAILS` is a comma-separated allowlist. The access key is never sent to
the browser after sign-in; the browser receives only an HTTP-only, signed
session cookie. The Supabase service-role key remains server-only.
