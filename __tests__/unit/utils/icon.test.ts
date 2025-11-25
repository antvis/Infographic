import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ElementTypeEnum } from '../../../src/constants';
import * as resource from '../../../src/resource';
import {
  createIconElement,
  getIconElement,
  isIconElement,
  updateIconElement,
} from '../../../src/utils/icon';

const hrefSpy = vi.spyOn(resource, 'getResourceHref');

describe('icon utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hrefSpy.mockImplementation((value) => {
      return `#${typeof value === 'string' ? value : 'resource'}`;
    });
  });

  afterAll(() => {
    hrefSpy.mockRestore();
  });

  it('creates icon element with default color', () => {
    const icon = createIconElement('foo');

    expect(resource.getResourceHref).toHaveBeenCalledWith('foo');
    expect(icon.tagName.toLowerCase()).toBe('use');
    expect(icon.getAttribute('data-element-type')).toBe(ElementTypeEnum.Icon);
    expect(icon.getAttribute('href')).toBe('#foo');
    expect(icon.style.color.toLowerCase()).toBe('currentcolor');
  });

  it('updates href, attributes, and computed color', () => {
    const icon = createIconElement('start');

    updateIconElement(icon, 'next', { stroke: '#0f0' });

    expect(resource.getResourceHref).toHaveBeenCalledWith('next');
    expect(icon.getAttribute('href')).toBe('#next');
    expect(icon.getAttribute('stroke')).toBe('#0f0');
    expect(icon.style.color).toBe('rgb(0, 255, 0)');
  });

  it('prefers fill color when provided', () => {
    const icon = createIconElement('filled', { fill: '#123456' });
    expect(icon.style.color).toBe('rgb(18, 52, 86)');
  });

  it('returns icon element from wrappers', () => {
    const icon = createIconElement('inner');
    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.setAttribute('data-element-type', ElementTypeEnum.IconGroup);
    wrapper.appendChild(icon);

    expect(getIconElement(icon)).toBe(icon);
    expect(getIconElement(wrapper)).toBe(icon);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    expect(getIconElement(rect)).toBeNull();
  });

  it('detects icon elements by data attribute', () => {
    const icon = createIconElement('id');
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('data-element-type', ElementTypeEnum.IconGroup);

    expect(isIconElement(icon)).toBe(true);
    expect(isIconElement(group)).toBe(true);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    expect(isIconElement(rect)).toBe(false);
  });
});
