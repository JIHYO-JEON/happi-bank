const controllers = require('../../controllers');
const moment = require('moment');

const showStartSetting = async ({ event, client }) => {
  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '🌱  Start saving happy memories',
                  emoji: true,
                },
                value: 'startSetting',
                action_id: 'startSetting',
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const showDepositButton = async ({ event, client }) => {
  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '📥  Deposit your happy memory ',
                  emoji: true,
                },
                value: 'addMemory',
                action_id: 'addMemory',
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const showWithdrawButton = async ({ event, client }) => {
  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '🎉  *Now* you can see your memories!',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: '> > > > > 👇👇🏻👇🏼👇🏽👇🏾👇🏿 < < < < <',
              emoji: true,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '📤  Withdraw your happy memory ',
                  emoji: true,
                },
                value: 'withdraw',
                action_id: 'withdraw',
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: '> > > > > ☝️☝🏻☝🏼☝🏽☝🏾☝🏿 < < < < <',
              emoji: true,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: '💗 Memories will be sent to #channel.',
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const canIOpen = (happiBank) => {
  return happiBank.dueDate < moment().format('MMDD') ? true : false;
};

module.exports = async ({ body, event, client }) => {
  const happiBank = await controllers.findSaving({ body });
  happiBank
    ? canIOpen(happiBank)
      ? showWithdrawButton({ event, client })
      : showDepositButton({ event, client })
    : showStartSetting({ event, client });
};
