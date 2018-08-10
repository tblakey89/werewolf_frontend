import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer';

describe('Footer', () => {
  let wrapper;

  beforeEach(() => {
    const conversations = [
      {id: 1},
      {id: 2},
    ]
    const games = [
      {id: 1},
      {id: 2},
    ]
    wrapper = shallow(<Footer conversations={conversations} games={games}/>);
  });

  describe('chat/:id renders correct conversation', () => {
    it('the render function selects correctly', () => {
      const match = { params: { id: 2 } }
      expect(wrapper.find('Route').first().props().render({match}).props.conversation.id).toEqual(2)
    });
  });
});
