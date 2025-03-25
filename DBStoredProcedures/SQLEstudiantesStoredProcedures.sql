-- Tabla que almacena el catálogo de errores
CREATE TABLE dbo.CatalogoErrores
(
    NumeroError INT NOT NULL PRIMARY KEY,
    Descripcion VARCHAR(500) NOT NULL
);
GO

-- Se registra en el catálogo el error 50000
INSERT INTO dbo.CatalogoErrores (NumeroError, Descripcion)
VALUES (50000, 'Error genérico de la aplicación');
GO

-- Tabla que almacena los errores registrados
CREATE TABLE dbo.RegistroErrores
(
    IdRegistroError INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    NumeroError INT NOT NULL,
    FechaError DATETIME NOT NULL DEFAULT(GETDATE()),
    MensajeError NVARCHAR(4000) NOT NULL
);
GO

-- SP para registrar errores en la tabla RegistroErrores
CREATE PROCEDURE dbo.SpRegistrarError
(
    @inNumeroError INT,
    @inMensajeError NVARCHAR(4000)
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO dbo.RegistroErrores (NumeroError, MensajeError)
        VALUES (@inNumeroError, @inMensajeError);
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
    SET NOCOUNT OFF;
END;
GO

-- SP para listar empleados
CREATE PROCEDURE dbo.SpListarEmpleados
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT id, Nombre, Salario
        FROM dbo.Empleado
        ORDER BY Nombre ASC;
    END TRY
    BEGIN CATCH
        EXEC dbo.SpRegistrarError
            @inNumeroError = 50000,
            @inMensajeError = ERROR_MESSAGE;
        THROW;
    END CATCH;
    SET NOCOUNT OFF;
END;
GO

-- SP para insertar empleados
CREATE PROCEDURE dbo.SpInsertarEmpleado
(
    @inNombre VARCHAR(128),
    @inSalario MONEY,
    @outCodigoError INT OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM dbo.Empleado WHERE Nombre = @inNombre)
        BEGIN
            SET @outCodigoError = 1;
            RETURN;
        END;

        INSERT INTO dbo.Empleado (Nombre, Salario)
        VALUES (@inNombre, @inSalario);

        SET @outCodigoError = 0;
    END TRY
    BEGIN CATCH
        SET @outCodigoError = 50000;
        EXEC dbo.SpRegistrarError
            @inNumeroError = @outCodigoError,
            @inMensajeError = ERROR_MESSAGE;
        THROW;
    END CATCH;
    SET NOCOUNT OFF;
END;
GO
