-- =====================================================
-- Migration 002: Add metadata JSONB column to content
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
