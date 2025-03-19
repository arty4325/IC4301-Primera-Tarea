CREATE PROCEDURE dbo.SpListarEmpleados
AS
BEGIN
    SELECT 
        id,
        Nombre,
        Salario
    FROM dbo.Empleado
    ORDER BY Nombre ASC;
END;
GO


CREATE PROCEDURE dbo.SpInsertarEmpleado
    @Nombre VARCHAR(128),
    @Salario MONEY,
    @CodigoError INT OUTPUT  
AS
BEGIN
    SET NOCOUNT ON;

    -- Primero se verifica si ya existe
    IF EXISTS (SELECT 1 FROM dbo.Empleado WHERE Nombre = @Nombre)
    BEGIN
        -- Se da un codigo de error 1, si el empleado existe
        SET @CodigoError = 1;
        RETURN;
    END

    -- Si no existe, se inserta
    INSERT INTO dbo.Empleado(Nombre, Salario)
    VALUES (@Nombre, @Salario);

    -- Si todo salio bien, 0 en el CodigoError
    SET @CodigoError = 0;
END;
GO
