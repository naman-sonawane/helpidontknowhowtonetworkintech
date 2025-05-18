// scripts/populateProfilesModule.js
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const Profile = require('../models/profileModel');

// Function to generate conversation starters and interests using AI
async function generateProfileContent(profile) {
  try {
    // Create a prompt based on profile data
    let prompt = `Given this LinkedIn profile information, generate: 
1) Five personalized conversation starters that would be good icebreakers when networking with this person
2) A list of 5-7 likely professional and personal interests this person might have based on their profile

Profile:
Name: ${profile.name}
${profile.rawData?.headline ? `Headline: ${profile.rawData.headline}` : ''}
${profile.rawData?.location ? `Location: ${profile.rawData.location}` : ''}
${profile.summary ? `Summary: ${profile.summary}` : ''}

${profile.rawData?.education && profile.rawData.education.length > 0 ? 
  `Education: ${profile.rawData.education.map(edu => 
    `${edu.school} - ${edu.degree || ''} ${edu.years ? `(${edu.years})` : ''}`
  ).join(', ')}` : ''}

${profile.rawData?.work_experience && profile.rawData.work_experience.length > 0 ? 
  `Work Experience: ${profile.rawData.work_experience.map(work => 
    `${work.title} at ${work.company} ${work.duration ? `(${work.duration})` : ''}`
  ).join(', ')}` : ''}

Format your response in JSON like this:
{
  "conversationStarters": ["starter1", "starter2", "starter3", "starter4", "starter5"],
  "interests": ["interest1", "interest2", "interest3", "interest4", "interest5", "interest6", "interest7"]
}`;

    // Call the AI endpoint
    const response = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`AI API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the content from the AI response
    const aiContent = data.choices[0].message.content;
    
    // Parse the JSON response
    // Find the JSON portion using regex in case there's surrounding text
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Couldn't extract JSON from AI response");
    }
    
    const jsonContent = JSON.parse(jsonMatch[0]);
    
    return {
      conversationStarters: jsonContent.conversationStarters,
      interests: jsonContent.interests
    };
  } catch (error) {
    console.error(`Error generating content for ${profile.name}:`, error);
    return {
      conversationStarters: [
        `Tell me about your role at ${profile.rawData?.work_experience?.[0]?.company || 'your company'}`,
        `How did you get into ${profile.rawData?.headline?.split(' at ')[0] || 'your field'}?`,
        `What brought you to the event today?`,
        `What projects are you currently working on?`,
        `What do you enjoy most about ${profile.rawData?.work_experience?.[0]?.title || 'your work'}?`
      ],
      interests: [
        profile.rawData?.headline?.split(' at ')[0] || 'Professional development',
        'Networking',
        'Technology',
        'Innovation',
        'Career growth',
        'Industry trends',
        profile.rawData?.education?.[0]?.school?.includes('University') ? 'Academia' : 'Learning'
      ]
    };
  }
}

// Update a specific profile
async function updateProfileContent(profileId) {
  try {
    // Find the profile by ID
    const profile = await Profile.findById(profileId);
    
    if (!profile) {
      console.error(`Profile with ID ${profileId} not found`);
      return false;
    }
    
    console.log(`Generating content for ${profile.name}...`);
    
    // Generate conversation starters and interests
    const { conversationStarters, interests } = await generateProfileContent(profile);
    
    // Update the profile
    await Profile.findByIdAndUpdate(profileId, {
      conversationStarters: conversationStarters,
      interests: interests
    });
    
    console.log(`Updated ${profile.name} with new conversation starters and interests`);
    return true;
  } catch (error) {
    console.error(`Error updating profile ${profileId}:`, error);
    return false;
  }
}

// Process all profiles
async function populateAllProfiles() {
  try {
    // Get all profiles
    const profiles = await Profile.find({});
    console.log(`Found ${profiles.length} profiles to process`);
    
    // Process each profile
    for (const profile of profiles) {
      // Check if profile needs updating
      const needsConversationStarters = !profile.conversationStarters || profile.conversationStarters.length === 0;
      const needsInterests = !profile.interests || profile.interests.length === 0;
      
      if (needsConversationStarters || needsInterests) {
        console.log(`Processing profile for ${profile.name}`);
        
        // Generate content
        const { conversationStarters, interests } = await generateProfileContent(profile);
        
        // Update only the fields that need updating
        const updateData = {};
        if (needsConversationStarters) {
          updateData.conversationStarters = conversationStarters;
        }
        if (needsInterests) {
          updateData.interests = interests;
        }
        
        // Update the profile
        await Profile.findByIdAndUpdate(profile._id, updateData);
        console.log(`Updated ${profile.name} with ${needsConversationStarters ? 'conversation starters' : ''} ${needsInterests ? 'interests' : ''}`);
        
        // Add a small delay to avoid hammering the AI service
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`Skipping ${profile.name} - already has conversation starters and interests`);
      }
    }
    
    console.log('All profiles processed successfully');
    return true;
  } catch (error) {
    console.error('Error processing profiles:', error);
    return false;
  }
}

// Export the functions
module.exports = {
  generateProfileContent,
  updateProfileContent,
  populateAllProfiles
};

// Run the script directly if called from command line
if (require.main === module) {
  // Connect to MongoDB when run as script
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpidontknowhowtonetworkintech')
    .then(() => {
      console.log('Connected to MongoDB');
      return populateAllProfiles();
    })
    .then(() => {
      process.exit(0);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}