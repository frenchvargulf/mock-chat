import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
    shallow(<App />);
});

it('includes input', () => {
    const app = shallow(<App />);
    expect(app.containsMatchingElement(<input />)).toEqual(true)
});

it('shows message when there is no input username', () => {
    const usersList = shallow(<Chat currentUsername={} />);
    expect(usersList.text()).toContain('No results!')
});

it(`doesn't show message when there are users`, () => {
    const usersList = shallow(<Chat currentUsername={['User']} />);
    expect(usersList.text()).not.toContain('No results!')
});

it(`shows a list of users`, () => {
    const users = 'Michal';
    const usersList = shallow(<Chat users={users} />);
    expect(usersList.find('li').length).toEqual(users.length);
});

describe('user', () => {
    const users = 'Michal';
    const usersList = shallow(<Chat currentUser={users} />);
    
    users.forEach(user => {
        it(`includes name ${user} on the list`, () => {
            expect(usersList.containsMatchingElement(<li>{user}</li>)).toEqual(true)
        });
    });
});