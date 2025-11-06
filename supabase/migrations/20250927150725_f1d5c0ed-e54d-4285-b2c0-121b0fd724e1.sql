-- Ensure pgcrypto extension is available (safe to run repeatedly)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recreate handle_new_user to be resilient if pgcrypto/gen_random_bytes is unavailable
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  wallet_suffix text;
BEGIN
  -- Try to generate with pgcrypto; fall back to md5/random if unavailable
  BEGIN
    wallet_suffix := encode(gen_random_bytes(4), 'hex');
  EXCEPTION
    WHEN undefined_function THEN
      wallet_suffix := substr(md5(random()::text || clock_timestamp()::text || NEW.id::text), 1, 8);
  END;

  INSERT INTO public.profiles (user_id, username, wallet_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    '0x' || wallet_suffix || '...'
  );
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users to call handle_new_user after signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created'
      AND n.nspname = 'auth'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END$$;