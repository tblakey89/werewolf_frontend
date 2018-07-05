import React from 'react';
import { shallow } from 'enzyme';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  let wrapper;
  let conversation;
  let channelPush;

  beforeEach(() => {
    channelPush = jest.fn();
    conversation = {
      channel: {
        push: channelPush
      }
    }
    wrapper = shallow(shallow(<ChatInput conversation={conversation}/>).get(0));
  });

  describe('loads ChatInput component', () => {
    let form;
    beforeEach(() => {
      form = wrapper.find('form').first();
    });

    describe('trying to submit with no message', () => {
      beforeEach(() => {
        form.simulate('submit', {preventDefault: () => {}});
      });

      it('does not call the push function', () => {
        expect(channelPush.mock.calls.length).toEqual(0);
      });

      describe('fills in message', () => {
        beforeEach(() => {
          const input = wrapper.find('#chatInput').first();
          input.simulate('change', {
            target: { value: 'message' },
          });
          wrapper.update();
        });

        it('changes state of component', () => {
          expect(wrapper.state().message).toEqual('message');
        });

        describe('submitting form', () => {
          beforeEach(() => {
            form.simulate('submit', {preventDefault: () => {}});
          });

          it('calls the push function', () => {
            expect(channelPush.mock.calls.length).toEqual(1);
          });
        });
      });
    });
  });
});
