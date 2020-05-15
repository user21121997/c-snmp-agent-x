
-- Query1: Query for Table Creation
CREATE TABLE SNMPSIGNALS ( ID INT PRIMARY KEY    NOT NULL, SIGNALVALUE  INT    NOT NULL, SIGNALTIME  TIMESTAMP NOT NULL);

-- Query2: Query for Inserting Some Values
INSERT INTO SNMPSIGNALS(ID,SIGNALVALUE,SIGNALTIME) 
VALUES (1,'4', to_timestamp('10-05-2020 15:36:38', 'dd-mm-yyyy hh24:mi:ss') ), (2, '10', to_timestamp('10-05-2020 15:40:38', 'dd-mm-yyyy hh24:mi:ss'));

--Query3: Query for Getting Latest Signal Value
SELECT SIGNALVALUE FROM SNMPSIGNALS ORDER BY SIGNALTIME DESC  LIMIT 1 ;
