var Sequelize = require('sequelize');
var sequelize = new Sequelize('photogallery', 'root', '',
    {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        //logging: false
    }
);




// var Post = sequelize.define('post', {
//     title: Sequelize.STRING,
//     text:  Sequelize.TEXT,
//     key:  {type: Sequelize.STRING, 
//             unique: true,
            //get: function(){
                //var currentValue = this.getDataValue('key')
                //if (!currentValue){
                    //var shajs = require('sha.js')
                    //this.setDataValue('key',shajs('sha256').update(`${Math.random}${(new Date()).toString()}${this.text}${this.title}`).digest('hex'))
                //}
                //return this.getDataValue('key')
            //},
            //set: function(){
            //}}
//     }
// },{
//  getterMethods: {
//     tagz() {
//       return this.getTags().then(tagz => tagz.map(tag => tag.title))
//     },
//     age() {
//         return (((new Date).getTime() - this.createdAt.getTime()) / 3600000).toFixed(0) + ' hrs ago';
//     }
//   },
// })


const Album = sequelize.define('album', {
    title: Sequelize.STRING,
    desc:  Sequelize.TEXT,
    fileName: Sequelize.STRING
})


const Img = sequelize.define('img', {
    fileName: Sequelize.STRING,
    title: Sequelize.STRING,
    desc:  Sequelize.TEXT
})



Album.hasMany(Img)
Img.belongsTo(Album)






// Post.beforeCreate(function(model, options) {
//     return new Promise ((resolve, reject) => {
//         var shajs = require('sha.js')
//         model.key = shajs('sha256').update(`${Math.random}${(new Date()).toString()}${this.text}${this.title}`).digest('hex')
//         resolve(model, options)
//     });
// })

// var Comment = sequelize.define('comment',{
//     text: Sequelize.TEXT
// })

// Post.hasMany(Comment)
// Comment.belongsTo(Post)

// Comment.hasMany(Comment)
// Comment.belongsTo(Comment)

// var Tag = sequelize.define('tag', {
//     title: Sequelize.STRING
// })

// Tag.belongsToMany(Post, {through: 'PostTag'})
// Post.belongsToMany(Tag, {through: 'PostTag'})


async function fillDB(){
    await sequelize.sync()
    var albumFirst = await Album.create( {
                            title: 'First album',
                            desc: 'Album desc',
                            fileName: 'rocks.jpg'
                        })
    var albumSecond = await Album.create( {
                            title: 'Second album',
                            desc: 'Album desc',
                            fileName: 'valley.jpg'
                        })
    var imgFirst = await Img.create( {
                            fileName: 'Your First img',
                            title: 'IMG title',
                            desc: 'IMG desc',
                            fileName: 'rocks.jpg'
                        })
    var imgSecond = await Img.create( {
                            fileName: 'Your Second img',
                            title: 'IMG title',
                            desc: 'IMG desc',
                            fileName: 'valley.jpg'
                        })
    albumFirst.addImg(imgFirst)
    albumSecond.addImg(imgSecond)
    // console.log(await img.getAlbum())

}

// fillDB()
//

// async function getAlbum({id}){
//   //return Post.findById(id).then( post => (post.comments = post.getComments(), post) )
//   let album = await Album.findOne({
//       where: {
//           key: id
//       }
//   })
//   //console.log(post.createdAt, typeof post.createdAt, post.createdAt.getTime())
//   return album;
// }


async function getAlbums(args){
  let albums = await Album.findAll({})
  for (let album of albums){
      album.timestamp = album.createdAt.getTime()/1000
  }
  return albums;
}

async function getAlbum(args){
    let id = args.id
    let album = await Album.findById(id)
    album.imgs = await album.getImgs()
    console.log(album.imgs)
    return album;
}

async function getImg({id}){
  //return Post.findById(id).then( post => (post.comments = post.getComments(), post) )
  let img = await Img.findOne({
      where: {
          key: id
      }
  })
  //console.log(post.createdAt, typeof post.createdAt, post.createdAt.getTime())
  return img;
}

async function getImgs(args){
  let imgs = await Img.findAll({})
  for (let img of imgs){
    img.timestamp = img.createdAt.getTime()/1000
  }
  return imgs;
}

//
// async function getData(){
//     var tag1 = await Tag.findOne({
//         where: {
//             title: 'tag1'
//         }
//     })

//     //console.log(await tag1.getPosts())

//     for (let post of await tag1.getPosts()){
//         console.log('TAG1', post.title)
//     }

//     var comment1 = await Comment.findOne({
//         where: {
//             id: 1
//         }
//     })

//     for (let comment of await comment1.getComments()){
//         console.log('comment1 sub comment:', comment.text)
//         console.log('parent', (await comment.getComment()).text)
//     }

//     var post1 =(await comment1.getPost());

//     console.log(`${post1.text} at ${post1.createdAt}`)
//     console.log(await post1.tagz)
//     console.log(post1.age)
// }

// getData()

// +

// async function getData(){

//     var album = await Album.findOne({
//         where: {
//             id: 1
//         }
//     })

// }

// getData()

// +


var express = require('express');
const cors  = require('cors')
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');




// GraphQL schema

var schema = buildSchema(`
    type Query {
        albums: [Album]
        album(id: Int!): Album
        imgs:   [Img]
        img(id: Int!): Img

    }
    
    type Album {
        title: String
        desc:  String
        id: Int
        fileName: String
        imgs: [Img]
      }

    type Img {
      title: String
      desc:  String
      id: Int
      fileName: String
      imgs: [Img]
    }

`);












// var schema = buildSchema(`
//     type Query {
//         post(id: String!): Post
//         comments(id: Int!): [Comment]
//         subComments(id: Int!): [Comment]
//         posts: [Post]
//     }
//     type Mutation {
//         createPost(title: String!, text: String!): Post
//         createComment(postID: Int!, text: String!): Post
//     }

//     type Post {
//         id: Int
//         title: String
//         text:  String
//         age:   String
//         tagz:  [String]
//         comments: [Comment]
//         timestamp: Int
//         key: String
//     }
//     type Comment {
//         id: Int
//         text:  String
//         age:   String
//         commentId: Int
//     }
// `);

// async function getPost({id}){
    //return Post.findById(id).then( post => (post.comments = post.getComments(), post) )
    // let post = await Post.findOne({
    //     where: {
    //         key: id
    //     }
    // })
    // if (post){
    //     post.comments = await post.getComments()
    //     post.timestamp = post.createdAt.getTime()/1000
    // }
    //console.log(post.createdAt, typeof post.createdAt, post.createdAt.getTime())
//     return post;
// }



// async function getPosts(args){
//     let posts = await Post.findAll({})
//     for (let post of posts){
//         post.timestamp = post.createdAt.getTime()/1000
//     }
//     return posts;
// }

// function getPostComments(args){
//     let id = args.id
//     return Post.findById(id)
//         .then( post => post.getComments() )
//         .then( comments => comments.filter( comment => !comment.commentId))
// }


// async function getSubComments(args){
//     let id = args.id
//     //return Comment.findById(id).then( comment => comment.getComments() )
//     let comment = await Comment.findById(id)
//     return comment.getComments()
// }

// async function createPost({title, text}){
//     return Post.create({title, text})
// }

// async function createComment({postID, text}){
//     let post    = await Post.findById(postID)
//     let comment = await Comment.create({text})
//     post.addComment(comment)
//     return comment
// }


// Root resolver

var root = {
  album: getAlbum,
  albums: getAlbums,
  img: getImg,
  imgs: getImgs
};



// Create an express server and a GraphQL endpoint

var app = express();
app.use(cors());


app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

app.use(express.static('public'));


//query getPost($postID: Int!){
  //post(id:$postID){
    //text
    //timestamp
  //}
//}

//query getComments($postID: Int!){
  //comments(id:$postID){
    //text
  //}
//}

//query getPostWithComments($postID: Int!){
  //post(id:$postID){
    //text	
    //comments {
      //text
      //age
    //}
  //}
//}

//query getSubComments($commentID: Int!){
  //subComments(id:$commentID){
    //text
  //}
//}

//mutation createPost($title: String!, $text:String!) {
  //createPost(title: $title, text: $text) {
     //title
     //text
  //}
//}

//mutation createComment($postID:Int!, $text:String!) {
  //createComment(postID: $postID, text: $text) {     
     //text
  //}
//}






// query variable
// {
//     "albumId": 2
//   }