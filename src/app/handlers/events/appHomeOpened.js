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
                  text: 'π±  Start saving happy memories',
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
                  text: 'π₯  Deposit your happy memory ',
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
              text: 'π  *Now* you can see your memories!',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: '> > > > > πππ»ππΌππ½ππΎππΏ < < < < <',
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
                  text: 'π€  Withdraw your happy memory ',
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
              text: '> > > > > βοΈβπ»βπΌβπ½βπΎβπΏ < < < < <',
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
                text: 'π Memories will be sent to #happi-memories.',
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
  const today = moment().format('MMDD');
  return happiBank && !happiBank.dueDate ? true : false;
};

const isNewYear = (happiBank) => {
  return !happiBank.dueDate && happiBank.thisYear.length === 0 ? true : false;
};

const showHomeScreen = ({ happiBank, event, client }) => {
  if (canIOpen(happiBank)) {
    showWithdrawButton({ event, client });
  } else {
    showDepositButton({ event, client });
  }
};

module.exports = async ({ body, event, client }) => {
  const happiBank = await controllers.findSaving({ body });
  const shouldShowOnboarding =
    !happiBank || (happiBank && isNewYear(happiBank));

  if (shouldShowOnboarding) {
    showStartSetting({ event, client });
  } else {
    showHomeScreen({ event, happiBank, client });
  }
};
