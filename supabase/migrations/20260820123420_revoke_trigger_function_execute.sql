-- touch_updated_at is a trigger function: triggers fire as the table owner, so
-- nothing needs to call it directly. Exposed through PostgREST it was a
-- SECURITY DEFINER entry point callable by anonymous visitors.
revoke execute on function public.touch_updated_at() from public;
revoke execute on function public.touch_updated_at() from anon;
revoke execute on function public.touch_updated_at() from authenticated;
