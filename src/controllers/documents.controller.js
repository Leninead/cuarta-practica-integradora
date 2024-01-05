const User = require('../models/User');

async function uploadDocuments(req, res) {
  try {
    const userId = req.params.uid;
    const documents = req.files;

    // Logic for handling document uploads
    // For simplicity, let's assume each document has a name and reference
    const processedDocuments = documents.map((doc) => ({
      name: doc.originalname,
      reference: doc.filename, // Modify this based on your needs
    }));

    // Save the processed documents to the user with the specified UID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the processed documents to the user's documents array
    user.documents = user.documents.concat(processedDocuments);

    // Save the updated user with the new documents
    await user.save();

    res.status(200).json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  uploadDocuments,
};
