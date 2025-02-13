const { Highrise, Events, Emotes} = require('highrise.sdk.dev');
const { Facing } = require("highrise.sdk.dev");
const { Reactions } = require("highrise.sdk.dev");
const token = "85898542c4a8abdba54c8b3418f430f817a512fb361852d56a40019bf3e4e2b4";
const room = "64e36c007fa97b38f87ea6a5";
const bot = new Highrise({
    Events: [
        Events.Messages,
        Events.Joins,
        Events.Emotes,
        Events.Leaves,
        Events.Movements,
        Events.Reactions,
        Events.DirectMessages,
        Events.Moderate,
     ],
});

// Log that the bot is ready.

bot.on('ready', (session) => {
    console.log("[READY] Bot is ready!".green + ` Session: ${session}`);
    bot.outfit.change("default").catch(e => console.error(e));
    bot.player.teleport(bot.info.user.id, 11.5, 0, 4.5, Facing.FrontRight)
      .catch(e => console.error("[ERROR] Failed to teleport:", e));
});

setInterval(() => {
    bot.message.send("Du kannst entscheiden welche Musik für eine Woche hier läuft! 🎶\nSpende 50g und du hast freie Wahl 🥳");
}, 120000); 

//Emote event

const activeLoops = new Map(); // Stores looping emotes per user

const emotes = {
  kiss: { id: "emote-kiss", duration: 3 },
  laugh: { id: "emote-laughing", duration: 3 },
  sit: { id: "idle-loop-sitfloor", duration: 10 },
  lust: { id: "emote-lust", duration: 5 },
  curse: { id: "emoji-cursing", duration: 2.5 },
  greedy: { id: "emote-greedy", duration: 4.8 },
  flex: { id: "emoji-flex", duration: 3 },
  gag: { id: "emoji-gagging", duration: 6 },
  celebrate: { id: "emoji-celebrate", duration: 4 },
  macarena: { id: "dance-macarena", duration: 12.5 },
  tiktok8: { id: "dance-tiktok8", duration: 11 },
  blackpink: { id: "dance-blackpink", duration: 7 },
  model: { id: "emote-model", duration: 6.3 },
  tiktok2: { id: "dance-tiktok2", duration: 11 },
  pennywise: { id: "dance-pennywise", duration: 1.5 },
  bow: { id: "emote-bow", duration: 3.3 },
  russian: { id: "dance-russian", duration: 10.3 },
  curtsy: { id: "emote-curtsy", duration: 2.8 },
  snowball: { id: "emote-snowball", duration: 6 },
  hot: { id: "emote-hot", duration: 4.8 },
  snowangel: { id: "emote-snowangel", duration: 6.8 },
  charge: { id: "emote-charging", duration: 8.5 },
  cartdance: { id: "dance-shoppingcart", duration: 8 },
  confused: { id: "emote-confused", duration: 9.3 },
  hype: { id: "idle-enthusiastic", duration: 16.5 },
  psychic: { id: "emote-telekinesis", duration: 11 },
  float: { id: "emote-float", duration: 9.3 },
  teleport: { id: "emote-teleporting", duration: 12.5 },
  swordfight: { id: "emote-swordfight", duration: 6 },
  maniac: { id: "emote-maniac", duration: 5.5 },
  energyball: { id: "emote-energyball", duration: 8.3 },
  snake: { id: "emote-snake", duration: 6 },
  sing: { id: "idle_singing", duration: 11 },
  frog: { id: "emote-frog", duration: 15 },
  pose: { id: "emote-superpose", duration: 4.6 },
  cute: { id: "emote-cute", duration: 7.3 },
  tiktok9: { id: "dance-tiktok9", duration: 13 },
  weird: { id: "dance-weird", duration: 22 },
  tiktok10: { id: "dance-tiktok10", duration: 9 },
  pose7: { id: "emote-pose7", duration: 5.3 },
  pose8: { id: "emote-pose8", duration: 4.6 },
  casualdance: { id: "idle-dance-casual", duration: 9.7 },
  pose1: { id: "emote-pose1", duration: 3 },
  pose3: { id: "emote-pose3", duration: 4.7 },
  pose5: { id: "emote-pose5", duration: 5 },
  cutey: { id: "emote-cutey", duration: 3.5 },
  punkguitar: { id: "emote-punkguitar", duration: 10 },
  zombierun: { id: "emote-zombierun", duration: 10 },
  fashionista: { id: "emote-fashionista", duration: 6 },
  gravity: {id: "emote-gravity", duration: 9.8},
  icecream: { id: "dance-icecream", duration: 15 },
  wrongdance: { id: "dance-wrong", duration: 13 },
  uwu: { id: "idle-uwu", duration: 25 },
  tiktok4: { id: "idle-dance-tiktok4", duration: 16 },
  shy: { id: "emote-shy2", duration: 5 },
  anime: { id: "dance-anime", duration: 7.8 },
};

const emotePages = Math.ceil(Object.keys(emotes).length / 7);

bot.on("chatCreate", async (user, message) => {
  if(user.id === bot.info.user.id) return;
  const args = message.toLowerCase().split(" "); // Convert input to lowercase
  const command = args[0];
  const emoteName = args.slice(1).join(" ");
  if (command === "!assistemote") {
    const assistMessage = `
      List of Commands for User Fun:
      1.!emote <emote_name>
      2.!loop <emote_name>
      3.!stop
      4.!emotelist <page_number>
      Use these commands to have fun with emotes! 🎉
    `;

    bot.message.send(assistMessage).catch(e => console.error(e));
  }
  else if (command === "!emotelist") {
    const page = args[1] ? parseInt(args[1]) : 1;
    
    if (isNaN(page) || page < 1 || page > emotePages) {
      bot.message.send(`Usage: !emotelist <page_number>. Valid page numbers are from 1 to ${emotePages}.`);
      return;
    }

    const emoteKeys = Object.keys(emotes);
    const emotesForPage = emoteKeys.slice((page - 1) * 7, page * 7);
    
    let emoteListMessage = `Emote list (Page ${page}/${emotePages}):\n`;
    emotesForPage.forEach(emote => {
      emoteListMessage += `\`${emote}\` - ${emotes[emote].id}\n`;
    });

    bot.message.send(emoteListMessage).catch(e => console.error(e));
  }
  else if (command === "!emote") {
    if (!emotes[emoteName]) {
      bot.message.send(`Invalid emote name: ${emoteName}`);
      return;
    }

    bot.player.emote(user.id, emotes[emoteName].id)
      .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));

  } else if (command === "!loop") {
    if (!emotes[emoteName]) {
      bot.message.send(`Invalid emote name: ${emoteName}`);
      return;
    }

    // Stop previous loop if already active for the user
    if (activeLoops.has(user.id)) {
      clearInterval(activeLoops.get(user.id));
    }

    // Start looping the emote
    const loopInterval = setInterval(() => {
      bot.player.emote(user.id, emotes[emoteName].id)
        .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));
    }, emotes[emoteName].duration * 1000);

    activeLoops.set(user.id, loopInterval);
    bot.message.send(`Looping ${emoteName} for ${user.username}.`);

  } else if (command === "!stop") {
    if (activeLoops.has(user.id)) {
      clearInterval(activeLoops.get(user.id));
      activeLoops.delete(user.id);
      bot.message.send(`Stopped looping emotes for ${user.username}.`);
    } else {
      bot.message.send(`No active emote loop to stop.`);
    }
  }
});


bot.on("chatCreate",async(user,message)=>{
    if(user.id === bot.info.user.id) return;
    if(message.startsWith("!floor")){
        const targetfloor = message.split(" ")[1];
        if(targetfloor === "2"){
            bot.player.teleport(user.id, 11.5, 5, 5.5, Facing.FrontLeft);}
        else if(targetfloor === "3"){
            bot.player.teleport(user.id, 12.5, 14.25, 5.5, Facing.FrontLeft);}
        else if(targetfloor === "0"){
            bot.player.teleport(user.id, 12.5, 0, 9.5, Facing.FrontLeft);
        }
        }
    });

bot.on("chatCreate", async (user, message) => {
    if(user.id === bot.info.user.id) return;
    const args = message.split(" ");
    
    if (args[0] === "!teleport" && args[1] === "mod" && args[2].startsWith("@")) {
      if (user.id !== bot.info.owner.id) {
        bot.message.send("You are not authorized to use this command.");
          return;
      }
  
      const targetUsername = args[2].substring(1); // Remove '@' from username
  
      try {
        const targetId = await bot.room.players.id(targetUsername);
        if (!targetId) {
          bot.message.send("User not found.");
            return;
        }
  
        await bot.player.teleport(targetId,16.5, 15, 23.5, Facing.FrontLeft);
        bot.message.send(`Successfully teleported ${targetUsername}.`);
      } catch (e) {
        console.error(e);
        bot.message.send("An error occurred while teleporting.");
      }
    }
  });
  
  const fs = require('fs');
  const path = require('path');
  
  // Path to the JSON file to store player data
  const playerDataFile = path.join(__dirname, 'playerData.json');
  
  // Function to load the player data from the JSON file
  function loadPlayerData() {
    if (fs.existsSync(playerDataFile)) {
      const rawData = fs.readFileSync(playerDataFile);
      return JSON.parse(rawData);
    }
    return {};
  }
  
  // Function to save the player data to the JSON file
  function savePlayerData(data) {
    fs.writeFileSync(playerDataFile, JSON.stringify(data, null, 2), 'utf8');
  }
  
  // Player movement tracking and saving data
  bot.on("playerMove", (user, position) => {
    const playerData = loadPlayerData();
  
    // Log player movement and save their position
    if ('x' in position) {
      playerData[user.id] = {
        username: user.username,
        position: {
          x: position.x,
          y: position.y,
          z: position.z,
          facing: position.facing,
        },
      };
    } else {
      playerData[user.id] = {
        username: user.username,
        position: {
          entity_id: position.entity_id,
          anchor_ix: position.anchor_ix,
        },
      };
    }
  
    // Save updated player data to the JSON file
    savePlayerData(playerData);
  });
  
  // Player join event
  bot.on('playerJoin', (user, position) => {
    console.log(`[PLAYER JOINED]: ${user.username}:${user.id} - ${JSON.stringify(position)}`);
  
    // Teleport the user to a specific location
    bot.player.teleport(user.id, 3.5, 0, 1, Facing.FrontRight)
      .then(() => {
        // Wait 0.5 seconds before playing emote
        setTimeout(() => {
          bot.player.emote(bot.info.user.id, Emotes.Bow.id)
            .then(() => console.log(`[EMOTE] ${user.username} performed a bow`))
            .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));
  
          // Send welcome message
          bot.message.send(`Willkommen in Alfys Bar🐹 @${user.username} ! 
Wir wünschen dir Viel Spaß und ein Angenehmes Erlebnis🍹`);
  
          // Update the player's coordinates in playerData.json
          const updatedData = {
            username: user.username,
            userId: user.id,
            position: { x: 3.5, y: 0, z: 1 }, // The coordinates to which the player was teleported
            facing: 'FrontRight'
          };
  
          // Read the current player data from the file
          const playerData = loadPlayerData();
  
          // Add or update the player's data
          playerData[user.id] = updatedData;
  
          // Write the updated player data back to the file
          savePlayerData(playerData);
  
          console.log(`[PLAYER DATA] Updated coordinates for ${user.username}`);
        }, 500);
      })
      .catch(e => console.error(`[ERROR] Failed to teleport:`, e));
  });
  
  // Player leave event
  bot.on("playerLeave", (user) => {
    const playerData = loadPlayerData();
  
    // Remove the player's data when they leave
    if (playerData[user.id]) {
      delete playerData[user.id];
      savePlayerData(playerData);
    }
  
    console.log(`[PLAYER LEFT]: ${user.username}:${user.id}`);
  
    // Send a goodbye message
    bot.message.send(`Goodbye for now! Hope to see you again soon. Your next visit will make my day! 😊🚀`);
  
    // Perform a kiss emote
    bot.player.emote(bot.info.user.id, Emotes.Kiss.id)
      .then(() => console.log(`[EMOTE] ${user.username} performed a kiss`))
      .catch(e => console.error(`[ERROR] Failed to perform emote:`, e));
  });

// Function to load the player data from the JSON file
function loadPlayerData() {
  if (fs.existsSync(playerDataFile)) {
    const rawData = fs.readFileSync(playerDataFile);
    return JSON.parse(rawData);
  }
  return {};
}

// Listen to chat messages
bot.on("chatCreate", (user, message) => {
    if(user.id === bot.info.user.id) return;
  // If the message is "!goto @username"
  if (message.startsWith("!goto @")) {
    // Extract the target username from the message
    const targetUsername = message.split(" ")[1].replace('@','');
    
    // Load player data to check if the target player exists
    const playerData = loadPlayerData();

    // Find the target player by username (case insensitive)
    const targetPlayer = Object.values(playerData).find(player => player.username.toLowerCase() === targetUsername.toLowerCase());

    // Ensure that the user is not trying to teleport to the bot
    if (targetPlayer.username === bot.info.user.username || targetPlayer.username === "WaiterHome") {
        bot.message.send(`${user.username} cannot teleport to the bot.`);
        return;
    }

    if (!targetPlayer) {
      // If the player is not found in the data
      bot.message.send(`Player @${targetUsername} not found!`);
      return;
    }

    // Retrieve target player's coordinates
    const { x, y, z } = targetPlayer.position;

    // Perform teleportation to the target player's coordinates
    bot.player.teleport(user.id, x, y, z, Facing.FrontLeft)
      .then(() => {
        bot.message.send(`You have been teleported to ${targetUsername}'s location!`);
      })
      .catch(e => {
        console.error(`[ERROR] Failed to teleport:`, e);
        bot.message.send(`Failed to teleport to ${targetUsername}.`);
      });
  }
});
bot.on("chatCreate", async (user, message) => {
    if(user.id === bot.info.user.id) return;
    if (message === "!assist") {
      bot.message.send(
        "📌Commands Overview:\n"+
        "🔹 `!assistemote` - Learn about emote assist\n" +
        "🔹 `!teleport mod @username` - Teleport mod to the mod section\n" +
        "🔹 `!floor number` - Teleport to the desired floor\n" +
        "🔹 `!goto @username` - Teleport to user\n"
      );
    }
});

bot.on("chatCreate", async (user, message) => { 
    if(user.id === bot.info.user.id) return;
    const args = message.split(" ");
    const command = args[0].toLowerCase();

    if (command === "!add" && args[1] === "designer") {
        if (bot.info.owner.id !== user.id ) {
            bot.message.send("❌ You are not the bot owner!");
            return;
        }

        const targetUsername = args[2]?.replace("@", ""); // Remove '@' from mention
        if (!targetUsername) {
            bot.message.send("⚠️ Please mention a username: `!add designer @username`");
            return;
        }

        // Get all players in the room
        bot.room.players.get().then(players => {
            // Find the target user in the room
            const targetPlayer = players.find(([playerInfo]) => playerInfo.username === targetUsername);

            if (!targetPlayer) {
                bot.message.send(`❌ @${targetUsername} is not in the room!`);
                return;
            }

            const targetUserId = targetPlayer[0].id; // Extract user ID

            // Try to add the user as a designer
            bot.player.designer.add(targetUserId)
                .then(() => bot.message.send(`✅ @${targetUsername} has been added as a designer!`))
                .catch(e => {
                    console.error("Error adding designer:", e);
                    bot.message.send("⚠️ Failed to add designer.");
                });
        }).catch(e => {
            console.error("Error fetching players:", e);
            bot.message.send("⚠️ Failed to retrieve players in the room.");
        });
    }
});
bot.on("roomModerate", (moderator_id, target_id, action, duration) => {
    // Log the moderation event to the console.
    console.log(`[MODERATION]: ${moderator_id} - ${target_id} - ${action} - ${duration}`);
});

bot.login(token,room);
