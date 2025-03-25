CREATE PROCEDURE dbo.SpListarEmpleados
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            Nombre,
            Salario
        FROM dbo.Empleado
        ORDER BY Nombre ASC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;

    SET NOCOUNT OFF;
END;
GO

CREATE PROCEDURE dbo.SpInsertarEmpleado
    @inNombre VARCHAR(128),
    @inSalario MONEY,
    @outCodigoError INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Verificar si ya existe el empleado
        IF EXISTS (SELECT 1 FROM dbo.Empleado WHERE Nombre = @inNombre)
        BEGIN
            SET @outCodigoError = 1;
            RETURN;
        END;

        -- Insertar el nuevo empleado
        INSERT INTO dbo.Empleado (Nombre, Salario)
        VALUES (@inNombre, @inSalario);

        SET @outCodigoError = 0;
    END TRY
    BEGIN CATCH
        SET @outCodigoError = 50000;
        THROW;
    END CATCH;

    SET NOCOUNT OFF;
END;
GO
