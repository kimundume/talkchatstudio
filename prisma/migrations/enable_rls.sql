-- Enable Row Level Security (RLS) on all tables
-- This adds an extra security layer for Supabase

-- Enable RLS on all tables
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Channel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chatbot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trigger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatAssignment" ENABLE ROW LEVEL SECURITY;

-- Create policies that allow service role (your app) full access
-- But restrict direct API access

-- Policy for Account table
CREATE POLICY "Service role can manage accounts" ON "Account"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for Session table
CREATE POLICY "Service role can manage sessions" ON "Session"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for User table
CREATE POLICY "Service role can manage users" ON "User"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for VerificationToken table
CREATE POLICY "Service role can manage tokens" ON "VerificationToken"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for Tenant table
CREATE POLICY "Service role can manage tenants" ON "Tenant"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for Channel table
CREATE POLICY "Service role can manage channels" ON "Channel"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for Chatbot table
CREATE POLICY "Service role can manage chatbots" ON "Chatbot"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for Trigger table
CREATE POLICY "Service role can manage triggers" ON "Trigger"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for Conversation table
CREATE POLICY "Service role can manage conversations" ON "Conversation"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for Message table
CREATE POLICY "Service role can manage messages" ON "Message"
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for ChatAssignment table
CREATE POLICY "Service role can manage assignments" ON "ChatAssignment"
  FOR ALL
  USING (auth.role() = 'service_role');
