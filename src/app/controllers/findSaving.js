const db = require('../../db');

module.exports = async ({ body }) => {
  console.log(body);
  const workspaceId = body.team_id || body.view?.team_id || body.user?.team_id;
  const happiBank = await db.findSaving({ workspaceId });
  return happiBank;
};
