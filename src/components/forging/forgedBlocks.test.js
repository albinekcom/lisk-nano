import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import ForgedBlocks from './forgedBlocks';

chai.use(sinonChai);

describe('ForgedBlocks', () => {
  const forgedBlocks = [{
    id: '16113150790072764126',
    timestamp: 36280810,
    height: 29394,
    totalFee: 0,
    reward: 0,
  },
  {
    id: '13838471839278892195',
    version: 0,
    timestamp: 36280700,
    height: 29383,
    totalFee: 0,
    reward: 0,
  },
  {
    id: '5654150596698663763',
    version: 0,
    timestamp: 36279700,
    height: 29283,
    totalFee: 0,
    reward: 0,
  },
  ];
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ForgedBlocks forgedBlocks={forgedBlocks} />);
  });

  it('should render 1 Table component', () => {
    expect(wrapper.find('Table')).to.have.lengthOf(1);
  });

  it('should render TableHead component with 5 TableCell componenets', () => {
    expect(wrapper.find('TableHead')).to.have.lengthOf(1);
    expect(wrapper.find('TableHead').find('TableCell')).to.have.lengthOf(5);
  });

  it('should render 3 TableRow components', () => {
    expect(wrapper.find('TableRow')).to.have.lengthOf(3);
  });
});
