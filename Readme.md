# Setting up a Custom SNMP Agent with Custom Enterprise OIDs

This project  contains custom SNMP Agent Implemented in C/C++ and Javascript to monitor a Linux Server using Simple Networking Managment Protocol. Project is an initial step towards learning and understanding SNMP. 
I have verified all the code on elementaryOS (Ubuntu distribution), However installation/commands may vary on other operating system. Please check before using it.
## Work  Breakdown
Using Divide and Conquer approach,  I dissected the problem in the following sub tasks:
1. Reading about basics of SNMP Protocol (Agent, Monitor, OID's, MIB's) (2-3 hours)
2. Setup of SNMP client and understanding of basic cli commands to better understand the concept. (2-3 hours)
3. Learned about writing MIB files, POSTGRESQL (libpq-fe) C library , documentation on extending SNMP agent.  (4-5 hours)
4. Started coding the modules and integrated driver functions with particular handlers. 
(4-5 hours)
5. Writing Readme (1 hour)

## Design
There are many posibilities to extend net snmp to implement custom OID's:
1. Use of Shell/Perl script by configuration of snmpd.conf file with 'pass' keyword.
2. Implementation of Dynamically Loadable Objects
3. Using extend keyword.
4. Using modern languages and built-in libraries to implement AgentX protocol.
5. Writing MIB module and compile it into the net-snmp snmpd agent.

I have used the dynamically loadable object approach (which I consider optimal from all), where shared objects, binary files  can be loaded by the snmpd daemon directly and are executed as part of the daemon. The extension resides in its own binary file and is loaded by the agent at runtime. This adds the flexibility to add new functionality / MIBs after the agent has been compiled, enabling you to extent the daemon provided by a binary package without the need to roll your own modified package.It would also scale nicely and gives us flexibility. However, a small programmatic error in the custom extension may result in crash of the entire daemon. For this firstly, I have created a custom MIB file with enterprise ID of affiniti, i.e 53864, with three Object type MIB modules for each task. Then I have created skeleton code in C, using mib2c command line utility. Now, I have created the driver functions, and set the scalar values returned from driver functions in the handler. 
Furthermore, I have also implemented AgentX protocol using node-net-snmp library in nodejs. The reason for doing that also was its simplicity as elegance. Furthermore the documentation was so simple to follow, that I went to implement that as well.

## Language Choice
I have coded in C language due to following reasons:
1. I had command in working with C/C++ (worked in OS, DS,Algos, GP GPU). 
2. As it was one of the recommended language.
3. C is highly portable and is used for scripting system applications which form a major part of Windows, UNIX and Linux operating system.
4. Official Documentation of net-snmp had tutorials in PERL, C SHELL and mib2c library for constructing C skeleton code.
5. C is a general-purpose programming language and can efficiently work on enterprise applications, games, graphics, and applications requiring calculations, etc.
6. C language has a great control and  is being greatly used for operating system as well as networking applications. 
7. C would make response time very fast as no InterProcess Communication or run-time libraries are required to get the results for a query. 

### Drawbacks
However, there are some drawbacks of this implementation as well:
1. To run the code we have  to  compile program and move it to lib folder to complete the run cycle and everytime we do some changes to the code we have to do the same process.  
2. Also, it is a better option always to test the code snippets seperately rather than all at once. Although,  In my case, I have tried to handle the errors.

### Other Approaches
1. Working in shell script would be indeed the easiest and fastest way to approach the problem, However, there is performance decline if try to extend and include more tasks in the program with it due to its interpreting nature. There for scalability indeed would be a concern.
2. PERL, indeed has the most documentation regarding implementation of SNMP's However, I had no experience working with it and it would have sheered my learning curve.PERL is also an interpreting language so problem also hold for it.

#### Not Implemented Due to Time Constraints and Complexity
1. Sub Agent in C (Agent X)
2. MIB module and compile it into the net-snmp snmpd agent

## Pre-Requiste (Databases)
1. In order to setup the database for the following program, please make sure to install POSTGRESQL in your linux machine along with dev-tools for C/C++. To install POSTGRES please run the following command:
```bash
sudo apt-get install postgresql 
sudo apt-get install libpq-dev
```
2. Now we will create the  user = 'rehan' and password = '123'  in postgres. To do that run the following command:
```bash
sudo -u postgres createuser rehan
```
3. To setup password run the command and enter the following query:
```bash
sudo -u postgres psql postgres
```
&nbsp;&nbsp;&nbsp;**Console:**
```bash
psql (10.12 (Ubuntu 10.12-0ubuntu0.18.04.1))
Type "help" for help.
postgres=# ALTER USER rehan WITH password '123';
ALTER ROLE
postgres=# \q
```

4. Now create the database named AFINITITEST table using the Query1 in database.sql or you can do that by running the following command:
```bash
sudo -u postgres createdb AFINITITEST --owner rehan
```
**Note**: I have ignored the sentance case for tables and used uppercase names as common convention. We can change it in any case (lower, camel) and can change the queries and commands accordingly.

5. Then run Query2, to insert some values ,  to do that run the below command:
```bash
psql AFINITITEST
```
then run the Query 2 from database.sql.

6. At last for SNMP agent to connect with Postgres, a configuration should be required:
```bash
sudo nano /etc/postgresql/<"version#">/main/pg_hba.conf
```
where version# is your postgres installed, In my case it was '10'
at line 90 change 'peer'  to  'md5'  like this:
```bash
# "local" is for Unix domain socket connections only
local   all             all                                     md5
```
Now restart the postgres service and we are good to go further.
## Installation

1. The project requires installation requires installation of net snmp, to install them in your linux server, execute the following commands in terminal.

```bash
sudo apt-get install snmpd snmp snmp-mibs-downloader
sudo apt-get install libperl-dev
```

2. After Installing net snmp, we will edit snmp.conf file, open it in your favorite editor. I will use nano:

```bash
sudo nano /etc/snmp/snmpd.conf
```

3. Add following lines to snmpd.conf

```bash
rocommunity public
rwcommunity public
dlmod scalarValues /usr/lib/libSnmpHandler.so
```
I have also included snmp.conf file in this repository. Please see it to consider the changes.
Also for nodejs project to work with Agentx, got to the last line of snmpd.conf file and un comment this line:
```base
agentXSocket    tcp:localhost:705
```
4. To check the location of mibs please run the following command:

```bash
net-snmp-config --default-mibdirs
```
&nbsp;&nbsp;&nbsp;**Output:**
```bash
$HOME/.snmp/mibs:/usr/local/share/snmp/mibs
```

5. I Will Place MY-COMPANY-MIB.txt Custom Mib At ```/home/<user>/.snmp/mibs```. If the directory is not present please create the .snmp and mibs folder. You can also place it in other path in previous output as well.

6. We will add below lines in `snmp.conf` for autolading of MIB and to enable debugging :
```bash
showmiberrors  yes
mibs +MY-COMPANY-MIB
```


**Note**: Please make sure to differentiate between 'snmp.conf' and 'snmpd.conf' as they are two different files. 

7. To run the application we will change directory to our source code, In my case I have put the code in .snmp folder. My command looks like this:
```bash
$ cd ~/.snmp
$ gcc -shared -fPIC scalarValues.c -o libSnmpHandler.so -I/usr/include/postgresql -lpq -std=c99
$ sudo cp libSnmpHandler.so /usr/lib
$ sudo /etc/init.d/snmpd restart
```
***Please note that you dont forget to include the library path and other arguments along with gcc command and restart snmpd service after that.***

8. Finally, you've an SNMP extended-agent running at UDP port 161 and listening for requests.
9. You can check everything is okay uptill now by running the following commad:
```bash
snmptranslate -IR -On MY-COMPANY-MIB::scalarValues
```
Our OID should be printed in console indicating everything is all good.
**Output**:
```bash
.1.3.6.1.4.1.53864.1
```

## Code Snippets
Although, I have tried to put extensive details regarding the functionality in comments in scalarValues.c file. I will explain the major driver functions for each task in this section.

>**Task 1:** The first OID should return a string denoting the version number of a software that runs on the system. You can return the static string ‘6.1.1’ for this OID
For Implementing this functionality, I have  just saved the value "6.1.1" in softwareVersion variable and set it to snmp variable using snmp set variable function.

```c
int
handle_hostVersionString(netsnmp_mib_handler *handler,
                          netsnmp_handler_registration *reginfo,
                          netsnmp_agent_request_info   *reqinfo,
                          netsnmp_request_info         *requests)
{
    /* We are never called for a GETNEXT if it's registered as a
       "instance", as it's "magically" handled for us.  */

    /* a instance handler also only hands us one request at a time, so
       we don't need to loop over a list of requests; we'll only get one. */
    strcpy(softwareVersion, "6.1.1");
    switch(reqinfo->mode) {

        case MODE_GET:
            snmp_set_var_typed_value(requests->requestvb, ASN_OCTET_STR,
                                    (u_char*) &softwareVersion,
                                     strlen(softwareVersion));
            break;


        default:
            /* we should never get here, so this is a really bad error */
            snmp_log(LOG_ERR, "unknown mode (%d) in handle_hostVersionString\n", reqinfo->mode );
            return SNMP_ERR_GENERR;
    }

    return SNMP_ERR_NOERROR;
}
```
>**Task2:** 	The second OID should query a Postgres table named ‘snmpSignals’ in a database named ‘afinitiTest’ and return the latest value of the column ‘signalValue’ as determined by the timestamp column ‘signalTime’. Please create the table yourself, fill it up with a few rows of data, and make the table creation and INSERT script part of your solution in a file named ‘database.sql’

I have used libpq-fe ( a C library which deals postgres databases connection). I have used error handling in case of failure in connection establishment or query failure. I have also PQclear and PQfinish function to clean up memory and close connection after the querying.  Error will be thrown as an output to the snmp client console. 
My getSignalsValue looks like this:
```c
char* getSignalsValue(){
    int size = 250; 
    char *query = (char *)malloc(sizeof(char)*size); /*Stored in heap segment*/
    *(str+249) = '\0';   
    PGconn *conn= PQconnectdb("user=rehan password=123 dbname=AFINITITEST");
    if (PQstatus(conn) == CONNECTION_BAD) {
        strcpy(query, "Connection to database failed\n"),
        PQerrorMessage(conn);

    } 
    else {
    PGresult *res = PQexec(conn, "SELECT SIGNALVALUE FROM SNMPSIGNALS ORDER BY SIGNALTIME DESC  LIMIT 1 ");
        if (PQresultStatus(res) != PGRES_TUPLES_OK) {
            strcpy(query, "No data retrieved\n");
            PQclear(res);
        }
        else{    
            int rows = PQntuples(res);
            for(int i=0; i<rows; i++) {
            strcpy(query, PQgetvalue(res, i, 0));
            } 
        }
    }
    PQfinish(conn);
    return query;
}
```
>**Task3:** The third OID should return the total disk space used (in bytes) for the /var/log/ folder
For disk calculation, there were no avaliable libraries in C (at least I coud'nt find out). We have used execlp, pipes and dup2 commands for computing linux shell commands in C during our operating system course, However, the function was not performing accordingly with SNMP handler. Thanks [Alex B's Answer](http://https://stackoverflow.com/questions/472697/how-do-i-get-the-size-of-a-directory-in-c "Alex B's Answer") , I found got to know about ftw library to recursively check for subdirectories and adding it to a static variable.  Following driver function for computing diskSpace in Bytes:

```c
int sum(const char *fpath, const struct stat *sb, int typeflag) {
    total += sb->st_size;
    return 0;
}

char* getDiskSpace(){
    total = 0;
    if (access("/var/log", R_OK)) {
        return "1";
    }
    if (ftw("/var/log", &sum, 1)) {
        perror("ftw");
        return "2";
    }
   sprintf(str, "%d", total);
    return str;


}
```
Dont forget to put `total = 0` else the static nature of variable will add the previous value with the current computation.

## Description

This SNMP agent is now exposed to  3 custom OIDs along with other built in OIDs. The details of which custom OIDs are as follows.

| #   | OID                 | MIB Mapping            | Request    | Description                                                       |
| --- | ------------------- | --------------- | ---------- | ----------------------------------------------------------------- |
| 1   | 1.3.6.1.4.1.53864.2.1.0 | hostVersionString | GET | returns the version number of the software running on the server |
| 2   | 1.3.6.1.4.1.53864.1.2.0 | hostValueSnmpSignal       | GET |returns  the most recent signalValue from SNMPSIGNALS table inside AFINITYTEST database                                          |
| 3   | .1.3.6.1.4.1.53864.1.3.0|  hostSizeDisk | GET | returns  the size in bytes of the directory /var/log|

## Testing/Usage

We will now test our customize agent. We will use the command line utilility comes with Net-SNMP.
Following is the command to make requests:
```bash
snmpget -v [snmpVersion] -c [communityString] [hostAddress] [oid]
```
Before Making request to OID's lets check if SNMP client is able to recognize our MIB or not, to do that we will run the following command:
```bash
snmptranslate MY-COMPANY-MIB::scalarValues
```
Now, We will make the request to these OID's and Observer the output:

1. Get software version. Please note that **.0** at the end of the OID indicates scalar type.

```bash
snmpget -v 2c -c public localhost  1.3.6.1.4.1.53864.1.1.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
SNMPv2-SMI::enterprises.53864.1.1.0 = STRING: "6.1.1"
```

2. Get the latest signal value from DB:

```bash
AFINITITEST=> select * from snmpsignals
AFINITITEST-> ;
 id | signalvalue |     signaltime      
----+-------------+---------------------
  1 |           4     | 2020-05-10 15:36:38
  2 |          10   | 2020-05-10 15:40:38
(2 rows)
	
```
From the above table it is evident that the latest value should be 10, that  should be returned. Now lets check it with snmp client.


```bash
snmpget -v 2c -c public localhost 1.3.6.1.4.1.53864.1.2.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
SNMPv2-SMI::enterprises.53864.1.2.0 =STRING: "10"
```
I have also tested this further,  by adding more data to DB and it worked correctly.
3. To get total disk space used in **/var/log** run the following OID:

```bash
snmpget -v 2c -c public localhost 1.3.6.1.4.1.53864.1.3.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
SNMPv2-SMI::enterprises.53864.1.3.0 = STRING: "523802639""
```
Now lets verify our result with shell commands:
```
$ sudo du -sh -B1 /var/log | cut -f1 
```
&nbsp;&nbsp;&nbsp;**Output:**
```
523952128
```
It is approximatley 128K in both the cases.

## Node JS SNMP (Optional)
As I found really simple library in JS so, I  also tried implementing custom OID SNMP sub agent with javascript using net-snmp npm module. Code can be found in the node folder.  Please run the` npm install` and `npm start ` to run the application. After that we can test the application with same commands given in the testing part. But In my opinion, this approach is an inferior approach.

Thank you. Feel Free to edit.
## References
1. Essential SNMP 2nd Edition
2. https://www.tutorialspoint.com/postgresql/
3. https://sourceforge.net/p/net-snm
4. http://www.net-snmp.org/wiki/index.php/Tutorials
5. http://zetcode.com/db/postgresqlc/
6. https://www.npmjs.com/package/net-snmp#using-this-module-snmp-agent
7. http://www.net-snmp.org/tutorial/tutorial-5/
## License
[MIT](https://choosealicense.com/licenses/mit/)
