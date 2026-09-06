const fs = require("fs");
const csv = require("csv-parser");
const Subscriber = require("../models/subscriber.model");

async function uploadSubscribers(filePath, creatorId){
    const subscribers = [];

    return new Promise((resolve, reject) => {

        fs.createReadStream(filePath)

        .pipe(csv())
        
        .on("data", (row)=>{
            subscribers.push(row);
        })
        
        .on("end", async () =>{

            try{

                const validSubscribers = [];
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                const emails = new Set();

                for(const subscriber of subscribers){
                    if (!subscriber.name?.trim() || !subscriber.email?.trim()){
                        continue;
                    }

                    const name = subscriber.name.trim();
                    const email = subscriber.email.trim().toLowerCase();

                    if(!emailRegex.test(email)) {
                        continue;
                    }

                    const existingSubscriber = await Subscriber.findOne({
                        email: email,
                        creatorId: creatorId
                    });

                    if(existingSubscriber){
                        continue;
                    }

                    if(emails.has(email)){
                        continue;
                    }

                    emails.add(email);

                    validSubscribers.push({
                        name,
                        email,
                        creatorId
                    });
                }

                const insertedSubscribers = await Subscriber.insertMany(validSubscribers);

                await fs.promises.unlink(filePath);

                resolve(insertedSubscribers);
            }
            catch(error){
                reject(error);
            }
        })

        .on("error", (error)=>{
            reject(error);
        });
    });

}

module.exports = { uploadSubscribers };