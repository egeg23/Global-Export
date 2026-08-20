-- A policy expression is evaluated with the querying role's privileges, so
-- every role the policies apply to needs EXECUTE — without it each query fails
-- with "permission denied for function is_admin" rather than returning no rows.
--
-- Exposing it over REST is harmless: it reports whether the *caller* is an
-- administrator and takes no arguments, so it reveals nothing about anyone else.
grant execute on function public.is_admin() to anon, authenticated;
