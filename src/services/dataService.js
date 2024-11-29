const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}

async function getData() {
  const db = new Firestore();
  const predictCollection = db.collection("prediction");

  try {
    const snapshot = await predictCollection.get();

    if (snapshot.empty) {
      return [];
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    throw new InputError("Failed to fetch prediction history");
  }
}

module.exports = { storeData, getData };
