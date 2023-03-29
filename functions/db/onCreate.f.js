const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Configuration, OpenAIApi} = require("openai");
const {encryptData, decryptData} = require("../utils/encryptions");
const {appuuidv1} = require("../utils/uuidGenerator");

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const processMessageForResponse = async (message) => {
    const userQuery = decryptData({cipherText: message.data, secret: process.env.ENCRPTION_SECRET_KEY});
    const messageID = appuuidv1();
    try {
        const response = await openai.createChatCompletion({
            model: process.env.OPEN_AI_MODEL,
            messages: [{role:"user", content: userQuery}],
            temperature: 0,
        })
        //TODO : user usage and price
        const encrptedMessage = encryptData({data: response.data.choices[0].message.content, secret: process.env.ENCRPTION_SECRET_KEY});
        await admin.firestore().collection("messages").doc(messageID).set({
            data: encrptedMessage,
            timeStamp: (new Date()).valueOf(),
            uid: messageID,
            status: "sent",
            sender: ["bot"],
            receiver: [message.sender[0]]
        });
        return;
    } catch (error) {
        functions.logger.error("Response from openai01 ", error);
        return {error: error}
    }
}

exports.newMessage = functions.firestore.document("messages/{docId}").onCreate(async (snap, context) => {
    let message = snap.data();
    if (message.receiver[0] === "bot") await processMessageForResponse(message);
    return;
});



