const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.DB_URI;

// function for authorizing the user
function authUser(res, reqBody) {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
        if (err){
            console.error(err);
            db.close();
        }
        
        var dbo = db.db("Blogs");
        
        const { userName, password } = reqBody;
        const query = { $and: [{ userName }, { password }] };
        
        if (reqBody) {
            dbo.collection("Blog").findOne(query, (err, result) => {
                if (err) throw err;
                if (result) {
                    // const response = JSON.stringify(result);
                    res.send("authorized");
                    console.log("authorized successfully");
                } else {
                    console.log("user not found");
                    res.send("user not found")

                }
                db.close();
                console.log("authUser closed");
            });
        }
    });
}

function getBlogData(res, reqParams) {
    MongoClient.connect(
        uri,
        {
            useUnifiedTopology: true,
        },
        (err, db) => {
            if (err){
                console.error(err);
                db.close();
            }
            var dbo = db.db("Blogs");

            const query = {
                userName: reqParams.user,
            };

            if (reqParams) {
                dbo.collection("Blog").findOne(query, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        const response = JSON.stringify(result);
                        res.send(response);
                        console.log(result);
                    } else {
                        res.send("user not found")
                    }
                    db.close();

                    console.log("getBlogData db closed");
                });
            }
        }
    );
}

function addBlogData(res, reqBody) {
    MongoClient.connect(
        uri,
        {
            useUnifiedTopology: true,
        },
        (err, db) => {
            if (err){
                console.error(err);
                db.close();
            }
            var dbo = db.db("Blogs");

            // date object
            const date = new Date();
            // find Query
            const findquery = {
                userName: reqBody.userName,
            };
            //update query
            const update = {
                $push: {
                    BlogText: {
                        Text: reqBody.BlogText,
                        date,
                    },
                },
            };
            //insert query if user not exits
            // const insertUser = {
            //     userName: reqBody.userName,
            //     BlogText: [
            //         {
            //             Text: reqBody.BlogText,
            //             date,
            //         },
            //     ],
            // };

            if (reqBody.BlogText) {
                dbo.collection("Blog").findOne(findquery, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        dbo.collection("Blog")
                            .updateOne(findquery, update, (err, result) => {
                                if (err) throw err;
                                if (result) {
                                    console.log("posted");
                                    res.send("posted");
                                } else {
                                    console.log("user not found");
                                }

                                db.close();
                                console.log("update db Closed");
                            });

                          
                           
                    }
                });

                
            }
        }
    );
}

// function for deletion of blog

function deleteBlog(res, reqBody) {
    MongoClient.connect(
        uri,
        {
            useUnifiedTopology: true,
        },
        (err, db) => {
            if (err){
                console.error(err);
                db.close();
            }
            var dbo = db.db("Blogs");

            const { userName, BlogText } = reqBody;

            const query = { userName };

            const { Text } = BlogText;
            console.log(Text);

            const pullQuery = {
                $pull: {
                    BlogText: {
                        Text,
                    },
                },
            };

            if (reqBody) {
                dbo.collection("Blog").updateOne(query, pullQuery, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        res.send("deleted");
                        console.log("deleted");
                    }
                    db.close();
                    console.log("deleteBlog db closed");
                });
            }
        }
    );
}

// const client = new MongoClient(uri, {
//     useUnifiedTopology: true
// });

// async function for add posts
// async function addData(res, reqBody) {
//     try {
//         await client.connect();
//         // date object
//         const date = new Date();
//         // find Query
//         const findquery = {
//             userName: reqBody.userName
//         };
//         //update query
//         const update = {
//             $push: {
//                 "BlogText": {
//                     Text: reqBody.BlogText,
//                     date
//                 }
//             }
//         };
//         //insert query if user not exits
//         const insertUser = {
//             userName: reqBody.userName,
//             BlogText: [{
//                 Text: reqBody.BlogText,
//                 date
//             }]

//         };

//         //DataBase and collection info
//         const database = client.db("Blogs");
//         const collection = database.collection("Blog");

//         // if req data exists then search for the avaliable user and update its blog
//         // if user not exist then insert user
//         if (reqBody) {
//             const search = await collection.findOne(findquery);

//             if (search) {
//                 const result = await collection.updateOne(findquery, update);
//                 console.log(result.modifiedCount, "doc is modified");

//             } else {
//                 const addUser = await collection.insertOne(insertUser);
//                 console.log(addUser.insertedCount, "user is added");
//             }
//         }

//     } finally {
//         await client.close();
//         res.send("posted");
//     }
// }

// Function for serving posts data to frontend
// async function getBlogData(res, reqParams) {
//     try {
//         await client.connect();

//         // Storing parameters from the request body
//         const query = { userName: reqParams.user }

//         //DataBase and collection info
//         const database = client.db("Blogs");
//         const collection = database.collection("Blog");

//         //searching for blogs
//         if (reqParams) {
//             const result = await collection.findOne(query);

//             if (result) {
//                 const servedResult = JSON.stringify(result);
//                 res.send(servedResult);
//                 console.log(result);

//             } else {
//                 res.send("user not found")
//             }
//         }

//     } finally {
//         await client.close();
//         console.log("Db closed");
//     }

// }

module.exports = {
    addBlogData,
    getBlogData,
    deleteBlog,
    authUser,
};
