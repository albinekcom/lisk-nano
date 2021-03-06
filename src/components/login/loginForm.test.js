import React from 'react';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { mount, shallow } from 'enzyme';
import Lisk from 'lisk-js';
import Cookies from 'js-cookie';
import LoginForm from './loginForm';

chai.use(sinonChai);

describe('LoginForm', () => {
  let wrapper;
  // Mocking store
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };

  const props = {
    peers: {},
    account,
    history: {},
    onAccountUpdated: () => {},
    setActiveDialog: spy(),
    activePeerSet: (network) => {
      props.peers.data = Lisk.api(network);
    },
  };
  props.spyActivePeerSet = spy(props.activePeerSet);

  describe('Generals', () => {
    beforeEach(() => {
      wrapper = mount(<LoginForm {...props} />);
    });

    it('should render a form tag', () => {
    });

    it('should render address input if state.network === 2', () => {
      wrapper.setState({ network: 2 });
      expect(wrapper.find('.address')).to.have.lengthOf(1);
    });

    it('should allow to change passphrase field to type="text"', () => {
      expect(wrapper.find('.passphrase input').props().type).to.equal('password');
      wrapper.setState({ showPassphrase: true });
      expect(wrapper.find('.passphrase input').props().type).to.equal('text');
    });

    it('should show "Invalid passphrase" error message if passphrase is invalid', () => {
      wrapper.find('.passphrase input').simulate('change', { target: { value: 'INVALID' } });
      expect(wrapper.find('.passphrase').text()).to.contain('Invalid passphrase');
    });

    it('should show call props.setActiveDialog when "new account" button is clicked', () => {
      wrapper.find('.new-account-button').simulate('click');
      expect(props.setActiveDialog).to.have.been.calledWith();
    });
  });

  describe('componentDidMount', () => {
    it('calls devPreFill', () => {
      const spyFn = spy(LoginForm.prototype, 'devPreFill');
      mount(<LoginForm {...props} />);
      expect(spyFn).to.have.been.calledWith();
    });
  });

  describe('componentDidUpdate', () => {
    const address = 'http:localhost:8080';
    props.account = { address: 'dummy' };
    props.history = {
      replace: spy(),
      location: {
        search: '',
      },
    };

    it('calls this.props.history.replace(\'/main/transactions\')', () => {
      wrapper = mount(<LoginForm {...props} />);
      wrapper.setProps(props);
      expect(props.history.replace).to.have.been.calledWith('/main/transactions');
    });

    it('calls Cookies.set(\'address\', address) if this.state.address', () => {
      const spyFn = spy(Cookies, 'set');
      wrapper = mount(<LoginForm {...props} />);
      wrapper.setState({ address });
      wrapper.setProps(props);
      expect(spyFn).to.have.been.calledWith('address', address);

      spyFn.restore();
      Cookies.remove('address');
    });
  });

  describe('validateUrl', () => {
    beforeEach('', () => {
      wrapper = shallow(<LoginForm {...props} />);
    });

    it('should set address and addressValidity="" for a valid address', () => {
      const validURL = 'http://localhost:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity correctly event without http', () => {
      const validURL = '127.0.0.1:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity="URL is invalid" for a valid address', () => {
      const validURL = 'http:localhost:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: 'URL is invalid',
      };
      expect(data).to.deep.equal(expectedData);
    });
  });

  describe('validatePassphrase', () => {
    beforeEach('', () => {
      wrapper = shallow(<LoginForm {...props} />);
    });

    it('should set passphraseValidity="" for a valid passphrase', () => {
      const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
      const data = wrapper.instance().validatePassphrase(passphrase);
      const expectedData = {
        passphrase,
        passphraseValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set passphraseValidity="Empty passphrase" for an empty string', () => {
      const passphrase = '';
      const data = wrapper.instance().validatePassphrase(passphrase);
      const expectedData = {
        passphrase,
        passphraseValidity: 'Empty passphrase',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it.skip('should set passphraseValidity="Invalid passphrase" for a non-empty invalid passphrase', () => {
      const passphrase = 'invalid passphrase';
      const data = wrapper.instance().validatePassphrase(passphrase);
      const expectedData = {
        passphrase,
        passphraseValidity: 'URL is invalid',
      };
      expect(data).to.deep.equal(expectedData);
    });
  });

  describe('changeHandler', () => {
    it('call setState with matching data', () => {
      wrapper = shallow(<LoginForm {...props} />);
      const key = 'network';
      const value = 0;
      const spyFn = spy(LoginForm.prototype, 'setState');
      wrapper.instance().changeHandler(key, value);
      expect(spyFn).to.have.been.calledWith({ [key]: value });
    });
  });

  describe('onLoginSubmission', () => {
    it.skip('it should call activePeerSet', () => {
      wrapper = shallow(<LoginForm {...props} />);
      wrapper.instance().onLoginSubmission();
      expect(wrapper.props().spyActivePeerSet).to.have.been.calledWith();
    });
  });

  describe.skip('devPreFill', () => {
    it('should call validateUrl', () => {
      const spyFn = spy(LoginForm.prototype, 'validateUrl');

      mount(<LoginForm {...props} />);
      expect(spyFn).to.have.been.calledWith();
    });

    it('should set state with correct network index and passphrase', () => {
      const spyFn = spy(LoginForm.prototype, 'validateUrl');
      const passphrase = 'Test Passphrase';
      document.cookie = 'address=http:localhost:4000';
      document.cookie = `passphrase=${passphrase}`;

      // for invalid address, it should set network to 0
      mount(<LoginForm {...props} />);
      expect(spyFn).to.have.been.calledWith({
        passphrase,
        network: 0,
      });

      LoginForm.prototype.validateUrl.restore();
    });

    it('should set state with correct network index and passphrase', () => {
      const spyFn = spy(LoginForm.prototype, 'validateUrl');
      // for valid address should set network to 2
      const passphrase = 'Test Passphrase';
      document.cookie = `passphrase=${passphrase}`;
      document.cookie = 'address=http://localhost:4000';
      mount(<LoginForm {...props} />);
      expect(spyFn).to.have.been.calledWith({
        passphrase,
        network: 2,
      });

      LoginForm.prototype.validateUrl.restore();
    });
  });
});
