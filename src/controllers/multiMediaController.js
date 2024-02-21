import pool from "../database/db.js";
import { NotFoundError } from "../errors/customError.js";
import cloudinary from "../utils/cloudinary.js";
import {v4 as uuidV4} from 'uuid'


const createText = async (req, res) => {
    const { content, formatting } = req.body;
    const userId = req.user.id
      const client = await pool.connect();
      // Check if the text already exists in the database based on some unique identifier
      const existingTextQuery = 'SELECT * FROM texts WHERE content = $1';
      const existingTextResult = await client.query(existingTextQuery, [content]);
      if (existingTextResult.rows.length > 0) {
        // If the text already exists, update it
        const updateTextQuery = 'UPDATE texts SET formatting = $1 WHERE content = $2';
        await client.query(updateTextQuery, [formatting, content]);
        res.status(200).json({ message: 'Text updated successfully' });
      } else {
        // If the text doesn't exist, create a new entry
        const insertTextQuery = 'INSERT INTO texts (content, formatting,user_id) VALUES ($1, $2, $3)';
        await client.query(insertTextQuery, [content, formatting, userId]);
        res.status(201).json({ message: 'Text created successfully' });
      }
      client.release();
  };

  const getTextId = async (req, res) => {
    const textId = req.params.text_id;
      const client = await pool.connect();
      // Retrieve the text by its ID
      const getTextQuery = 'SELECT * FROM texts WHERE text_id = $1';
      const textResult = await client.query(getTextQuery, [textId]);
  
      // Check if the text with the specified ID exists
      if (textResult.rows.length === 0) {
        res.status(404).json({ error: 'Text not found' });
      } else {
        const text = textResult.rows[0];
        res.status(200).json(text);
      }
  
      client.release();
  };
  
  const createLikeText =  async (req, res) => {
    console.log("here")
    const userId = req.user.id
    console.log("id",userId)
    const textId = req.params.text_id;
        const client = await pool.connect();
        // Check if the user has already liked the text
        console.log("here1")
        const checkLikeQuery = 'SELECT * FROM likes WHERE text_id = $1 AND user_id = $2';
        const checkLikeResult = await client.query(checkLikeQuery, [textId, userId]);
        if (checkLikeResult.rows.length > 0) {
          // User has already liked the text
          res.status(200).json({ success: false, message: 'You have already liked this text' });
        }
        console.log("here2")
        // If the user hasn't liked the text, insert a new like
        const likeQuery = 'INSERT INTO likes (text_id, user_id) VALUES ($1, $2)';
        await client.query(likeQuery, [textId, userId]);
        // Increment the like count in the texts table
        console.log("here3")
        const updateLikesQuery = 'UPDATE texts SET likes = likes + 1 WHERE text_id = $1';
        await client.query(updateLikesQuery, [textId]);
        client.release();
        console.log("here4")
        res.status(200).json({ success: true, message: 'Text liked successfully' });
  };
  

  const createComment = async (req, res) => {
    const textId = req.params.text_id;
    const userId = req.user.id
    const { comment} = req.body; 
      const client = await pool.connect();
      // Check if the text exists
      const textQuery = 'SELECT * FROM texts WHERE text_id = $1';
      const textResult = await client.query(textQuery, [textId]);
      if (textResult.rows.length === 0) {
        res.status(404).json({ error: 'Text not found' });
        client.release();
        return;
      }
      // Insert the comment into the comments table
      const insertCommentQuery = 'INSERT INTO comments (text_id, user_id, comment_text) VALUES ($1, $2, $3)';
      await client.query(insertCommentQuery, [textId, userId, comment]);
      res.status(201).json({ message: 'Comment added successfully' });
      client.release();
  };



  const createUserComment = async (req, res) => {
    const textId = req.params.text_id;
    const { comment, mentionedUserIds } = req.body; 
      const client = await pool.connect();
      // Check if the text exists
      const textQuery = 'SELECT * FROM texts WHERE text_id = $1';
      const textResult = await client.query(textQuery, [textId]);
      if (textResult.rows.length === 0) {
        res.status(404).json({ error: 'Text not found' });
        client.release();
        return;
      }
      // Insert the comment into the comments table
      const insertCommentQuery = 'INSERT INTO comments (text_id, comment_text) VALUES ($1, $2) RETURNING comment_id';
      const commentResult = await client.query(insertCommentQuery, [textId, comment]);
      const commentId = commentResult.rows[0].comment_id;
      // Insert user mentions into the mentions table
      console.log("mentionId",mentionedUserIds)
      if (mentionedUserIds && mentionedUserIds.length > 0) {
        const insertMentionsQuery = 'INSERT INTO mentions (comment_id, user_id) VALUES ';
        const values = mentionedUserIds.map(userId => `(${commentId}, ${userId})`).join(', ');
        await client.query(`${insertMentionsQuery}${values}`);
      }
      res.status(201).json({ message: 'Comment with user mentions added successfully' });
      client.release();
  };
  
  
  const createEmoji =  async (req, res) => {
    const textId = req.params.text_id;
    const { urlink } = req.body; 
      const client = await pool.connect();
      // Check if the text exists
      const textQuery = 'SELECT * FROM texts WHERE text_id = $1';
      const textResult = await client.query(textQuery, [textId]);
      if (textResult.rows.length === 0) {
        res.status(404).json({ error: 'Text not found' });
        client.release();
        return;
      }
      const emo = await pool.query('SELECT url FROM emoji WHERE text_id = $1',[textId])
      console.log("emo",emo.rows[0])
      const emoUrl = emo.rows[0]
      const {url} = emoUrl
      if(url.length > 0){
        await pool.query('UPDATE emoji SET url = $1 WHERE text_id = $2 RETURNING *',[url,textId])
      }else{
         // Update the content with emojis and GIFs
        await pool.query('INSERT INTO emoji (url,text_id) VALUES ($1,$2) RETURNING *',[urlink, textId]);
      }
      res.status(200).json({ message: 'Emojis and GIFs updated successfully' });
      client.release();
  };
  

  const createReport  =  async (req, res) => {
    const textId = req.params.text_id;
    const reporterUserId = req.user.id
    const { reason } = req.body; 
      const client = await pool.connect();
      // Check if the text exists
      const textQuery = 'SELECT * FROM texts WHERE text_id = $1';
      const textResult = await client.query(textQuery, [textId]);
      if (textResult.rows.length === 0) {
        res.status(404).json({ error: 'Text not found' });
        client.release();
        return;
      }
      // Insert the report into the reports table
      const insertReportQuery = 'INSERT INTO reports (text_id, user_id, reason) VALUES ($1, $2, $3)';
      await client.query(insertReportQuery, [textId, reporterUserId, reason]);
      res.status(201).json({ message: 'Text reported successfully' });
      client.release();
  };
  
 const createChatRoom = async (req, res) => {
  const createdBy = req.user.id
    const { roomName } = req.body; 
      const client = await pool.connect();
      // Check if the room name already exists
      const checkRoomQuery = 'SELECT * FROM chat_rooms WHERE room_name = $1';
      const checkRoomResult = await client.query(checkRoomQuery, [roomName]);
      if (checkRoomResult.rows.length > 0) {
        res.status(400).json({ error: 'Room name already exists' });
        client.release();
        return;
      }
      // Insert the new chat room into the chat_rooms table
      const insertRoomQuery = 'INSERT INTO chat_rooms (room_name, created_by) VALUES ($1, $2)';
      await client.query(insertRoomQuery, [roomName, createdBy]);
      res.status(201).json({ message: 'Chat room created successfully' });
      client.release();
  };
  

  const redirectRoom = async (req,res) =>{
    res.redirect(`/${uuidV4()}`)
  }


  const getChatRoom =  async (req, res) => {
    const user = req.user.id
    const roomId = req.params.roomId
      const client = await pool.connect();
      // Retrieve the list of chat rooms
      const roomsQuery = 'SELECT * FROM chat_rooms WHERE room_id = $1';
      const roomsResult = await client.query(roomsQuery,[roomId]);
      // Extract the rows from the result
      const rooms = roomsResult.rows;
      // Send the list of chat rooms as the response
      res.status(200).json(rooms);
      client.release();
  };

  const shareChatRoomMessage = async (req, res) => {
    const roomId = req.params.room_id;
    const senderId = req.user.id
    const { message } = req.body; // Assuming you have senderId and message in the request body
      const client = await pool.connect();
      // Check if the chat room exists
      const roomQuery = 'SELECT * FROM chat_rooms WHERE room_id = $1';
      const roomResult = await client.query(roomQuery, [roomId]);
      if (roomResult.rows.length === 0) {
        res.status(404).json({ error: 'Chat room not found' });
        client.release();
        return;
      }
      // Insert the message into the messages table
      const insertMessageQuery = 'INSERT INTO messages (room_id, user_id, message_text) VALUES ($1, $2, $3)';
      await client.query(insertMessageQuery, [roomId, senderId, message]);
      res.status(201).json({ message: 'Message sent successfully' });
      client.release();
  };
  
  const createVideo = async (req, res) => {
    const {description} = req.body
    await cloudinary.uploader.upload(req.file.path,{resource_type:"video"}, async function (err,result) {
      if(err){
        console.log(err)
        return res.status(500).json({
          success:false,
          message:"false"
        })
      }
      const {url,public_id} = result
      await pool.query('INSERT INTO content (file_name, cloudinary_url, public_id,file_desc) VALUES ($1, $2, $3, $4) RETURNING *',[req.file.originalname,url,public_id,description]);
      res.status(200).json({
        success: true,
        message:"uploaded",
        data:result
      })
    })
  
  };
  
  const createAudio =  async (req, res) => {
    const {description} = req.body
    await cloudinary.uploader.upload(req.file.path,{resource_type:"video"}, async function (err,result) {
      if(err){
        console.log(err)
        return res.status(500).json({
          success:false,
          message:"false"
        })
      }
      const {url,public_id} = result
       pool.query('INSERT INTO content (file_name, cloudinary_url, public_id,file_desc) VALUES ($1, $2, $3, $4) RETURNING *',[req.file.originalname,url,public_id,description]);
      res.status(200).json({
        success: true,
        message:"uploaded",
        data:result
      })
    })
  };
  

  const getContent =  async (req, res) => {
    console.log("here get content")
    const contentId = req.params.content_id;
      const client = await pool.connect();
      // Retrieve specific content by ID from the database
      const query = 'SELECT * FROM content WHERE content_id = $1';
      const result = await client.query(query, [contentId]);
      // Check if content with the provided ID exists
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
      const content = result.rows[0];
      // Send the content as the response
      res.status(200).json(content);
      client.release();
  };

  const displayImage = async (req, res) => {
    const { tags } = req.query; 
      const client = await pool.connect();
      // Build the query dynamically based on the provided tags
      let query = 'SELECT * FROM images';
      const values = [];
      if (tags) {
        const tagArray = tags.split(',');
        const placeholders = tagArray.map((tag, index) => `$${index + 1}`).join(',');
        query += ` WHERE tags && ARRAY[${placeholders}]`;
        values.push(...tagArray);
      }
      // Execute the query to retrieve images based on tags
      const result = await client.query(query, values);
      // Send the retrieved images as the response
      res.status(200).json(result.rows);
      client.release();
  };
  
  const sortContent =  async (req, res) => {
    console.log('here')
    const { sortBy } = req.query; 
      const client = await pool.connect();
      let query = 'SELECT * FROM content';
      console.log("query",query)
      // Dynamically adjust the query based on the sortBy parameter
      if (sortBy === 'upload_time') {
        query += ' ORDER BY upload_time DESC'; 
      } else if (sortBy === 'popularity') {
        query += ' ORDER BY popularity DESC'; 
      } else {
        // Default to sorting by upload time if sortBy parameter is not provided or invalid
        query += ' ORDER BY upload_time DESC';
      }
      // Execute the query to retrieve sorted content
      const result = await client.query(query);
      // Send the sorted content as the response
      res.status(200).json(result.rows);
      client.release();
  };
  
  const displayContentSlideshow = async (req, res) => {
      const client = await pool.connect();
      // Retrieve content from the database (assuming you have a content table)
      const query = 'SELECT * FROM content';
      const result = await client.query(query);
      // Assuming result.rows is an array of content objects
      const content = result.rows;
      // Your logic for organizing content into a slideshow format goes here
      // For simplicity, let's assume we send the content as-is for now
      res.status(200).json(content);
      client.release();
   
  };
  

  const displayCarousel =  async (req, res) => {
      const client = await pool.connect();
      // Retrieve content from the database (assuming you have a content table)
      const query = 'SELECT * FROM content';
      const result = await client.query(query);
      // Assuming result.rows is an array of content objects
      const content = result.rows;
      // Your logic for organizing content into a carousel format goes here
      // For simplicity, let's assume we send the content as-is for now
      res.status(200).json(content);
      client.release();
  };
  

  const createRecommendation =  async (req, res) => {
      // Assuming you have user information available in req.body or req.user
      const { userId } = req.body;
      const client = await pool.connect();
      // Your recommendation logic goes here
      // For example, you might retrieve user preferences or behavior from the database
      // Then, you can use that information to query for relevant content
      const recommendationsQuery = `
        SELECT * 
        FROM content 
        WHERE category IN (
          SELECT preferred_category 
          FROM user_preferences 
          WHERE user_id = $1
        )
        ORDER BY popularity DESC
        LIMIT 10;
      `;
  
      const recommendationsResult = await client.query(recommendationsQuery, [userId]);
      const recommendations = recommendationsResult.rows;
  
      res.status(200).json(recommendations);
  
      client.release();
   
  };
  

  const createContentLink =  async (req, res) => {
      // Assuming you have content information available in req.
      const userId = req.user.id
      const { contentId }= req.params;
      // Generate a unique referral link (you can use UUID or any other unique identifier)
      const referralLink = generateReferralLink();
      console.log("link",referralLink)
      // Store the shared content and referral link in the database
      const client = await pool.connect();
      const insertShareQuery = `
        INSERT INTO shared_content (content_id, user_id, referral_link, bookmarked)
        VALUES ($1, $2, $3, false)
      `;
      await client.query(insertShareQuery, [contentId, userId, referralLink]);
      // Send the referral link as the response
      res.status(201).json({ referralLink });
      client.release();
  };
  // Function to generate a unique referral link (for example)
  function generateReferralLink() {
    // Generate a random string or use UUID
    return 'http://e-publisher.com/referral/' + Math.random().toString(36).substring(2, 15);
  }
  

  const contentCategorization = async (req, res) => {
      // Assuming you have content and category information available in req.body
      const { contentId, categoryId, subCategoryId } = req.body;
      // Store the categorization information in the database
      const client = await pool.connect();
      const insertCategorizationQuery = `
        INSERT INTO content_categorization (content_id, category_id, sub_category_id)
        VALUES ($1, $2, $3)
      `;
      await client.query(insertCategorizationQuery, [contentId, categoryId, subCategoryId]);
      res.status(201).json({ message: 'Content categorized successfully' });
      client.release();
  };


    
  const createImage = async (req, res) => {
    const {description} = req.body
    await cloudinary.uploader.upload(req.file.path,{
      folder:"image",
      width: 300,
      crop:"scale"}, async function (err,result) {
      if(err){
        console.log("this is the err",err)
        return res.status(500).json({
          success:false,
          message:"false"
        })
      }
      const {url,public_id} = result
      await pool.query('INSERT INTO content (file_name, cloudinary_url, public_id,file_desc) VALUES ($1, $2, $3, $4) RETURNING *',[req.file.originalname,url,public_id,description]);
      res.status(200).json({
        success: true,
        message:"uploaded",
        data:result
      })
    }) 
  
  };


  const getAllImage = async (req,res) => {
    const { rows } = await pool.query("SELECT * FROM content WHERE file_name LIKE '%.jpeg' OR file_name LIKE '%.jpg' OR file_name LIKE '%.png'");
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Images not found' });
    } else {
      const imageAnalysis = rows;
      res.status(200).json({ success: true, imageAnalysis });
    }
  }

  
  const getImage = async (req,res) => {
    const { imageId } = req.params;
    const { rows } = await pool.query('SELECT * FROM content WHERE content_id = $1', [imageId]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Image analysis results not found' });
    } else {
      const imageAnalysis = rows[0];
      res.status(200).json({ success: true, imageAnalysis });
    }
  }



  export default {
    createText,
    getTextId,
    createLikeText,
    createComment,
    createUserComment,
    createEmoji,
    createReport,
    createChatRoom,
    getChatRoom,
    shareChatRoomMessage,
    createVideo,
    createAudio,
    getContent,
    displayImage,
    sortContent,
    displayContentSlideshow,
    displayCarousel,
    createRecommendation,
    createContentLink,
    contentCategorization,
    createImage,
    getAllImage,
    getImage,
    redirectRoom
}