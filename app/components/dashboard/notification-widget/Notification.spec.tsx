import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as React from 'react';
import { spy } from 'sinon';

import { Notification, NotificationType, infoClassName, warningClassName } from './Notification';

import { tid } from '../../../../test/testUtils';

const defaultProps = () => ({
	id: 1,
	type: NotificationType.INFO,
	text: 'test notification',
	onClose: spy(),
	actionLink: 'dashboard',
	actionLinkText: 'link text'
});

describe('<Notification />', () => {
	// it('should be of correct type', () => {
	// 	const props = defaultProps();
	// 	const componentInfo = shallow(<Notification {...props} type={NotificationType.INFO} />);
	// 	expect(componentInfo.find(tid('notification-text'))).to.have.className(infoClassName);
	// 	const componentWarning = shallow(<Notification {...props} type={NotificationType.WARNING} />);
	// 	expect(componentWarning).to.have.className(warningClassName);
	// });

	// it('should correct render notification', () => {
	// 	const props = defaultProps();
	// 	const component = shallow(<Notification {...props} />);
	// 	expect(component).to.have.className(infoClassName);
	// 	const text = component.find(tid('notification-text'));
	// 	expect(text.text()).to.be.eq(props.text);
	// 	const link = component.find(tid('notification-link'));
	// 	expect(link.text()).to.be.eq(props.actionLinkText);
	// });

	it('should call correct click handlers for close button', () => {
		const props = defaultProps();
		const component = shallow(<Notification {...props} />);
		component.find(tid('notification-close')).simulate('click');
		expect(props.onClose).to.be.calledOnce;
	});
});
