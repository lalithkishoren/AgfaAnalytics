-- ============================================================
-- ETL Watermark Config Table
-- Target : Microsoft Fabric Lakehouse (T-SQL)
-- Purpose: Track last extracted watermark per source table
--          for initial and incremental loads
-- ============================================================


-- ============================================================
-- CREATE TABLE
-- ============================================================

CREATE TABLE dbo.etl_watermark_config (
    config_id              INT            NOT NULL IDENTITY(1,1),
    source_system          NVARCHAR(10)   NOT NULL,               -- SAP ECC instance: AP1, AP2, AP6, AP7
    table_name             NVARCHAR(100)  NOT NULL,               -- SAP table name e.g. VBAK
    watermark_column       NVARCHAR(100)  NOT NULL,               -- Custom column added to source table
    last_watermark_value   NVARCHAR(50)   NOT NULL                -- Last successfully extracted watermark value
                               DEFAULT '1900-01-01 00:00:00.000',
    load_type              NVARCHAR(20)   NOT NULL                -- FULL or INCREMENTAL
                               DEFAULT 'INCREMENTAL',
    is_active              BIT            NOT NULL DEFAULT 1,     -- 1 = enabled, 0 = disabled/skip
    created_at             DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    updated_at             DATETIME2      NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT PK_etl_watermark_config
        PRIMARY KEY (config_id),

    CONSTRAINT UQ_etl_watermark_config_source_table
        UNIQUE (source_system, table_name),

    CONSTRAINT CHK_etl_watermark_config_load_type
        CHECK (load_type IN ('FULL', 'INCREMENTAL'))
);
GO


-- ============================================================
-- INSERT -- 48 rows (all source/table combinations)
-- last_watermark_value initialized to '1900-01-01 00:00:00.000'
-- so first run always does a full extract
-- Update watermark_column to match the column name you create in SAP
-- ============================================================

INSERT INTO dbo.etl_watermark_config
    (source_system, table_name, watermark_column, last_watermark_value, load_type, is_active)
VALUES
    -- AP1 (11 tables)
    ('AP1', 'COEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'MSKU',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBAK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBAP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBKD',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBREVE', 'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBRK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBRP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBUK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP1', 'VBUP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),

    -- AP2 (11 tables)
    ('AP2', 'COEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'MSKU',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBAK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBAP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBKD',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBREVE', 'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBRK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBRP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBUK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP2', 'VBUP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),

    -- AP6 (15 tables - includes Project System tables)
    ('AP6', 'COEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'MSKU',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'PROJ',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'PRPS',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'PRTE',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBAK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBAP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBKD',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBREVE', 'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBRK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBRP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBUK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'VBUP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP6', 'V_FPLT', 'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),

    -- AP7 (11 tables)
    ('AP7', 'COEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'MSKU',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBAK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBAP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBEP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBKD',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBREVE', 'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBRK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBRP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBUK',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1),
    ('AP7', 'VBUP',   'LAST_CHANGED_TS', '1900-01-01 00:00:00.000', 'INCREMENTAL', 1);
GO


-- ============================================================
-- USAGE REFERENCE
-- ============================================================

-- 1. Read watermark before extract (in ADF / Fabric pipeline):
--    SELECT source_system, table_name, watermark_column, last_watermark_value
--    FROM dbo.etl_watermark_config
--    WHERE source_system = 'AP1' AND table_name = 'VBAK' AND is_active = 1;

-- 2. Update watermark after successful load:
--    UPDATE dbo.etl_watermark_config
--    SET    last_watermark_value = '<new_max_value>',
--           updated_at           = GETUTCDATE()
--    WHERE  source_system = 'AP1' AND table_name = 'VBAK';

-- 3. Force full reload for a specific table:
--    UPDATE dbo.etl_watermark_config
--    SET    last_watermark_value = '1900-01-01 00:00:00.000',
--           updated_at           = GETUTCDATE()
--    WHERE  source_system = 'AP1' AND table_name = 'VBAK';

-- 4. Disable a table from pipeline:
--    UPDATE dbo.etl_watermark_config
--    SET    is_active  = 0,
--           updated_at = GETUTCDATE()
--    WHERE  source_system = 'AP1' AND table_name = 'VBAK';
