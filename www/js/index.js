/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready



var db;
document.addEventListener('deviceready', onDeviceReady, true);

function onDeviceReady() {

    //open the database

    db = window.sqlitePlugin.openDatabase({
        name: 'users.db',
        location: 'default'
    },
        function () {
            alert("DB Opened Successfully!");
        },
        function () {

            alert("DB Failed to open!");

        }

    );
    //create a table
    db.transaction(
        function (tx) {
            var query = "CREATE TABLE IF NOT EXISTS user1 (nickname TEXT PRIMARY KEY, username TEXT NOT NULL,password TEXT NOT NULL)";

            tx.executeSql(query, [],
                function (tx, result) {
                    alert("Table created Successfully!");
                },
                function (err) {
                    alert("error occured:" + err.code);
                }
            );
        }
    );

    db.transaction(function (tx) {
        tx.executeSql('SELECT *FROM user1', [],
            function (tx, results) {
                var len = results.rows.length;

                if (len > 0) {
                    htmlText = ""; // global variable
                    for (i = 0; i < len; i++) {
                        //local variable
                        htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                            "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                            "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                    }
                    $('#tblUser tbody').html(htmlText);
                } else {
                    htmlText = "<tr><td>No data found!</td></tr>"
                    $('#tblUser tbody').html(htmlText);
                }
                $('#tbtUserList').show();
            });
    });




}

$(document).ready(function () {
    $("#divAddStdBtn").show();

    //crossroad--> routing #
    //hasher --> 

    // Domain Name System localhost = 127.0.0.1
    //hasher
    function parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    }
    hasher.initialized.add(parseHash); //parse initial hash
    hasher.changed.add(parseHash); //parse hash changes
    hasher.init(); //start listening for history change
    hasher.setHash(link1);
    hasher.setHash(link2);
    hasher.setHash(link3);
    hasher.setHash(link4);
    hasher.setHash(linkBackupServer);
    hasher.setHash(linkRestore);


    var link1 = crossroads.addRoute('/sqliteclick', function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM user1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";


                        }

                        $('#tblUser tbody').html(htmlText);

                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblUser tbody').html(htmlText);
                    }
                    $('#tbtUserList').show();
                });
        });
        $("#divUserList").show();
        $("#divFrmShowUser").hide();
        $("#divFrmInputUser").hide();
        $("#divFrmEditUser").hide();
    });

    var link2 = crossroads.addRoute('viewuser/{nickname}', function (nickname) {

        alert("click on user nickname success! nickname=" + nickname);

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM user1 where nickname = ?', [nickname],
                function (tx, results) {


                    var nickname = String(results.rows.item(0).nickname);
                    var username = String(results.rows.item(0).username);
                    var password = String(results.rows.item(0).password);


                    $("#usernicknameshow").val(nickname);
                    $("#userusernameshow").val(username);
                    $("#userpasswordshow").val(password);
                    var editId = String("#btnEdit/" + nickname)
                    $("#idShowUser").attr("href", editId)
                    var DeleteId = String("#btnDelete/" + nickname)
                    $("#idDeleteUser").attr("href", DeleteId)
                });
        });

        $("#divUserList").hide();
        $("#divFrmShowUser").show();

    });

    var link3 = crossroads.addRoute('btnAddUser', function () {
        //code here
        $("#usernicknameinput").val("");
        $("#userusernameinput").val("");
        $("#userpasswordinput").val("");
        $("#divUserList").hide();
        $("#divFrmShowUser").hide();
        $("#divFrmEditUser").hide();
        $("#divFrmInputUser").show();
    });

    var link4 = crossroads.addRoute('btnEdit/{nickname}', function (nickname) {
        alert("click on user nickname success! nickname=" + nickname);
        var ids = String(nickname);

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM user1 where nickname = ?', [ids],
                function (tx, results) {

                    var nickname = String(results.rows.item(0).nickname);
                    var username = String(results.rows.item(0).username);
                    var password = String(results.rows.item(0).password);

                    $("#userNicknameEdit").val(nickname);
                    $("#userUsernameEdit").val(username);
                    $("#userPasswordEdit").val(password);
                });
        });

        $("#divFrmShowUser").hide();
        $("#divFrmEditUser").show();

    });

    var link5 = crossroads.addRoute('btnDelete/{nickname}', function (nickname) {
        var nickname = String(nickname);

        db.transaction(function (tx) {
            var result = confirm("Want to delete?");
            if (result) {
                tx.executeSql('DELETE FROM user1 where nickname = ?', [nickname],
                    function (tx, results) {
                        alert("User is deleted");
                    });
            } else {
                alert("account not deleted")
            }

        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM user1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tblUser tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblUser tbody').html(htmlText);
                    }
                    $('#tbtUserList').show();
                });
        });

        $("#divFrmShowUser").hide();
        $("#divFrmEditUser").hide();
        $("#divUserList").show();

    });

    var link6 = crossroads.addRoute('/info', function () {
        alert("This app is 1.Used to store Nickname, username and password 2. All data is stored locally 3. No internet connection is required except for backup and restore function 4. Can now backup existing database into mokde server using correct email 5. Can restore lost database from mokde server that was previously backed-up")
    });

    $("#divFrmInputUser").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var nickname = $("#usernicknameinput").val();
        var username = $("#userusernameinput").val();
        var password = $("#userpasswordinput").val();

        //db transaction
        db.transaction(function (tx) {
            var query = "INSERT INTO user1 (nickname, username, password) values(?, ?, ?)";
            tx.executeSql(query, [nickname, username, password],

                function (tx, results) {
                    alert("Data Inserted!");
                    $("#divUserList").show();
                    $("#divFrmShowUser").hide();
                    $("#divFrmInputUser").hide();
                },
                function (error) {
                    alert("Error, try again!");
                }
            );
        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM user1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tblUser tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblUser tbody').html(htmlText);
                    }
                    $('#tbtUserList').show();
                });
        });
    });

    $("#divFrmEditUser").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var nickname = $("#userNicknameEdit").val();
        var user = $("#userUsernameEdit").val();
        var password = $("#userPasswordEdit").val();


        //db transaction
        db.transaction(function (tx) {
            var query = "UPDATE user1 set username=?,password=? where nickname=?";
            tx.executeSql(query, [user, password, nickname],

                function (tx, results) {
                    alert("Data Updated!");
                    $("#divUserList").show();
                    $("#divFrmShowUser").hide();
                    $("#divFrmEditUser").hide();
                    $("#divFrmInputUser").hide();
                },
                function (error) {
                    alert("Error, try again!");
                }
            );
        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM user1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tblUser tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblUser tbody').html(htmlText);
                    }
                    $('#tbtUserList').show();
                });
        });
    });

    // function to backup local storage to cloud database
    var linkBackupServer = crossroads.addRoute('/backup', function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM user1', [],
                function (tx, results) {
                    var len = results.rows.length;
                    //Example : [{"nickname":"Maybank","usename":"ahmad","password": "1234" },{nickname":"Water","usename":"Faisal","password": "1234"}]
                    if (len > 0) {

                        //loading all data become json starts here 
                        alert("Click on Backup!")
                        //alert("length :" + len);
                        var firstnickName = results.rows.item(0).nickname;
                        var firstusername = results.rows.item(0).username;
                        var firstusernamepassword = results.rows.item(0).password;

                        //alert("Click on Backup : 1nickName :" + firstnickName);
                        //alert("Click on Backup!: firstUsername" + firstusername);
                        //alert("Click on Backup!: password :" + firstusernamepassword);

                        var alldata = [{ "nickname": firstnickName, "username": firstusername, "password": firstusernamepassword, }];
                        //alert("After first data becomes json");
                        //alert(JSON.stringify(alldata));




                        for (i = 1; i < len; i++) {
                            var nickName = results.rows.item(i).nickname;
                            var username = results.rows.item(i).username;
                            var usernamepassword = results.rows.item(i).password;

                            const data = [{ "nickname": nickName, "username": username, "password": usernamepassword, }];

                            alldata = alldata.concat(data);
                        }
                        //alert("After concate");
                        var printJson = JSON.stringify(alldata)
                        //alert(printJson);
                        //loading all data become json ends here 


                        //Starting to ask for user register email

                        var userEmail = prompt("Please enter the email that you use to login for the server", "default@gmail.com");

                        if (userEmail == null || userEmail == "") {
                            alert("You've cancelled the backup process.");
                        } else {
                            alert("Thank you for your email. We'll process your backup now!");
                            //alert("UserEmail:" + userEmail + " and data=" + JSON.stringify(alldata));

                            var alldataJsonString = JSON.stringify(alldata);
                            //alert("check for UserEmail :" + userEmail)
                            //alert("check for stringyfy :" + alldataJsonString)



                            var datalist = "userEmail=" + userEmail + "&data=" + JSON.stringify(alldataJsonString)
                            //alert("datalist :" + datalist);
                            $.ajax({

                                type: "post",
                                url: "https://kerbau.odaje.biz/mokdebackup.php",
                                data: datalist,
                                cache: false,
                                success: function (returneddata) {
                                    alert("link to cloud db successfully!")
                                    var data = JSON.parse(returneddata);
                                    if (data.status === 1) {
                                        alert("We got your back! Your data has been backed up!");
                                    } else if (data.status === 0) {
                                        alert("Failed to store data to cloud, Please contact server admin!");
                                    } else
                                        alert("Unknown error,Please contact admin!")

                                },
                                error: function () {
                                    alert("Please contact admin");

                                }
                            });
                        }

                        //End to ask for user register email
                    } else {
                        alert("Failed to backup!");
                    }



                    $('#tbtStudentList').show();

                });
        });
    });

    var linkRestore = crossroads.addRoute('/restore', function () {
        var emailtosearch = prompt("Email used to backup your database ?", "default@gmail.com");
        var datalist = "q=" + emailtosearch;
        //alert(datalist)
        $.ajax({

            type: "post",
            url: "https://kerbau.odaje.biz/mokderestore.php",
            data: datalist,
            cache: false,
            success: function (returneddata) {
                // login database successfully 
                alert("Connected to database!")
                //get data from database
                //convert returned string to JSON Object 
                var data = JSON.parse(returneddata);

                //alert("Data existed!")

                // retrieve only the data part
                var arraydatainJsonString = JSON.parse(data.data);


                // parse the Json string to Json object
                var arraydata = JSON.parse(arraydatainJsonString)

                // get the data length
                var datalength = arraydata.length;
                //alert("the length of arraydata is =" + datalength)

                var valueText = "";

                valueText = "('" + arraydata[0].nickname + "','" + arraydata[0].username + "','" + arraydata[0].password + "');";

                for (i = 1; i < datalength; i++) {
                    var nicknameinJsonArray = arraydata[i].nickname;
                    var usernameinJsonArray = arraydata[i].username;
                    var passwordinJsonArray = arraydata[i].password;


                    valueText = "('" + arraydata[i].nickname + "','" + arraydata[i].username + "','" + arraydata[i].password + "')," + valueText;

                }
                //alert(valueText);


                // clear all local storage
                db.transaction(function (tx) {
                    var result = confirm("Delete all local storage for restoration purpose?");
                    if (result) {
                        tx.executeSql('DELETE FROM user1', [],
                            function (tx, results) {
                                alert("Data in local storage is deleted");
                            });
                    } else {
                        alert(" You just cancel the restore process.")
                    }
                })




                db.transaction(function (tx) {
                    var query = "INSERT INTO user1 (nickname, username, password) values " + valueText;
                    //alert("query:" + query)
                    tx.executeSql(query, [],

                        function (tx, results) {
                            alert("Data Inserted For Restore!");

                        },
                        function (error) {
                            alert("Failed to insert data from local storage during restoring process, try again!");
                        }
                    );
                });

                db.transaction(function (tx) {
                    tx.executeSql('SELECT *FROM user1', [],
                        function (tx, results) {
                            var len = results.rows.length;

                            if (len > 0) {
                                htmlText = "";
                                for (i = 0; i < len; i++) {
                                    htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                        "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                        "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";

                                }

                                $('#tblUser tbody').html(htmlText);

                            } else {
                                htmlText = "<tr><td>No data found!</td></tr>"
                                $('#tblUser tbody').html(htmlText);
                            }
                            $('#tbtUserList').show();
                        });
                });
                $("#divUserList").show();


            },
            error: function () {
                alert("Please contact admin!")
            }
        });
    });

});
