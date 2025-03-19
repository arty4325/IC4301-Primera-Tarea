# -*- coding: utf-8 -*-
"""
Created on Wed Mar 19 08:56:39 2025

@author: artur
"""

import pyodbc
import random
import string

def insertar_nombres_random():

    connection_string = (
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=mssql-194296-0.cloudclusters.net,10047;"
        "DATABASE=DummyTest;"
        "UID=reactapp;"
        "PWD=#Franco123"
    )

    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    cursor.execute("""
    IF NOT EXISTS (
        SELECT * FROM sys.tables WHERE name = 'Nombres'
    )
    CREATE TABLE Nombres (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nombre VARCHAR(100)
    )
    """)
    conn.commit()

    for _ in range(100):
        nombre_aleatorio = ''.join(random.choice(string.ascii_letters) for _ in range(7))
        cursor.execute("INSERT INTO Nombres (Nombre) VALUES (?)", nombre_aleatorio)

    conn.commit()

    cursor.close()
    conn.close()

    print("Se han insertado 100 nombres aleatorios en la tabla 'Nombres'.")


if __name__ == "__main__":
    insertar_nombres_random()
