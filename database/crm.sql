IF DB_ID(N'CRM') IS NULL
BEGIN
    CREATE DATABASE CRM;
END
GO

USE CRM;
GO

IF OBJECT_ID(N'dbo.Clientes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Clientes (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Clientes PRIMARY KEY,
        Nome NVARCHAR(150) NOT NULL,
        Email NVARCHAR(150) NULL,
        Telefone NVARCHAR(30) NULL,
        Empresa NVARCHAR(150) NULL,
        Status NVARCHAR(30) NOT NULL CONSTRAINT DF_Clientes_Status DEFAULT N'Ativo',
        DataCadastro DATETIME2 NOT NULL CONSTRAINT DF_Clientes_DataCadastro DEFAULT SYSDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.Contatos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Contatos (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Contatos PRIMARY KEY,
        ClienteId INT NOT NULL,
        Assunto NVARCHAR(200) NOT NULL,
        Descricao NVARCHAR(MAX) NULL,
        DataContato DATETIME2 NOT NULL CONSTRAINT DF_Contatos_DataContato DEFAULT SYSDATETIME(),
        CONSTRAINT FK_Contatos_Clientes FOREIGN KEY (ClienteId) REFERENCES dbo.Clientes(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.Oportunidades', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Oportunidades (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Oportunidades PRIMARY KEY,
        ClienteId INT NOT NULL,
        Titulo NVARCHAR(200) NOT NULL,
        Valor DECIMAL(12,2) NOT NULL CONSTRAINT DF_Oportunidades_Valor DEFAULT 0,
        Etapa NVARCHAR(50) NOT NULL CONSTRAINT DF_Oportunidades_Etapa DEFAULT N'Novo',
        DataCriacao DATETIME2 NOT NULL CONSTRAINT DF_Oportunidades_DataCriacao DEFAULT SYSDATETIME(),
        CONSTRAINT FK_Oportunidades_Clientes FOREIGN KEY (ClienteId) REFERENCES dbo.Clientes(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.Tarefas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Tarefas (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Tarefas PRIMARY KEY,
        ClienteId INT NULL,
        Titulo NVARCHAR(200) NOT NULL,
        Descricao NVARCHAR(MAX) NULL,
        Vencimento DATE NULL,
        Concluida BIT NOT NULL CONSTRAINT DF_Tarefas_Concluida DEFAULT 0,
        CONSTRAINT FK_Tarefas_Clientes FOREIGN KEY (ClienteId) REFERENCES dbo.Clientes(Id)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Clientes)
BEGIN
    INSERT INTO dbo.Clientes (Nome, Email, Telefone, Empresa, Status)
    VALUES
    (N'João Silva', N'joao@email.com', N'(18) 99999-1111', N'Empresa Alpha', N'Ativo'),
    (N'Maria Santos', N'maria@email.com', N'(18) 99999-2222', N'Empresa Beta', N'Ativo'),
    (N'Carlos Oliveira', N'carlos@email.com', N'(18) 99999-3333', N'Empresa Gamma', N'Inativo');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Oportunidades)
BEGIN
    INSERT INTO dbo.Oportunidades (ClienteId, Titulo, Valor, Etapa)
    SELECT TOP 2 Id, N'Projeto CRM', 15000.00, N'Proposta' FROM dbo.Clientes ORDER BY Id;
END
GO
