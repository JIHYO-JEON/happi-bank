require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const workspaces = db.collection('workspace');
const FieldValue = admin.firestore.FieldValue;

const checkAll = async () => {
  try {
    const activeWorkspaces = await workspaces.where('dueDate', '!=', '').get();
    const returnValue = [];
    if (activeWorkspaces.empty) {
      console.log('No active happibanks.');
    }
    activeWorkspaces.forEach((doc) => {
      returnValue.push([doc.id, doc.data().dueDate]);
    });
    return returnValue;
  } catch (error) {
    console.error(error);
  }
};

const findSaving = async ({ workspaceId }) => {
  try {
    const workspace = await workspaces.doc(workspaceId).get();
    return workspace.exists ? workspace.data() : false;
  } catch (error) {
    console.error(error);
  }
};

const createSaving = async ({ workspaceId, dueDate }) => {
  try {
    await workspaces.doc(`${workspaceId}`).set({
      dueDate: dueDate,
      pastYears: {},
      thisYear: [],
      channelId: '',
    });
  } catch (error) {
    console.error(error);
  }
};

const startNewYear = async ({ workspaceId, dueDate }) => {
  try {
    await workspaces.doc(`${workspaceId}`).update({
      dueDate,
    });
  } catch (error) {
    console.error(error);
  }
};

const updateSaving = async ({ workspaceId, context }) => {
  try {
    await workspaces.doc(`${workspaceId}`).update({
      thisYear: FieldValue.arrayUnion(context),
    });
  } catch (error) {
    console.error(error);
  }
};

const createChannel = async ({ workspaceId, channelId }) => {
  try {
    await workspaces.doc(`${workspaceId}`).update({
      channelId: channelId,
    });
  } catch (error) {
    console.error(error);
  }
};

const stuffingThisYear = async ({ workspaceId, YYYY }) => {
  try {
    const happiBank = await findSaving({ workspaceId });
    const thisYear = {};
    thisYear[YYYY] = happiBank.thisYear;
    await workspaces.doc(`${workspaceId}`).update({
      pastYears: { ...thisYear },
      dueDate: '',
    });
  } catch (error) {
    console.error(error);
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const popMemory = async ({ workspaceId }) => {
  try {
    const happiBank = await findSaving({ workspaceId });
    const thisYear = happiBank.thisYear;
    const isLast = thisYear.length === 1 ? true : false;
    const memory = thisYear[getRandomInt(thisYear.length)];
    await workspaces.doc(`${workspaceId}`).update({
      thisYear: FieldValue.arrayRemove(memory),
    });
    return { ...memory, isLast };
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  checkAll,
  createSaving,
  startNewYear,
  findSaving,
  updateSaving,
  stuffingThisYear,
  popMemory,
  createChannel,
};
