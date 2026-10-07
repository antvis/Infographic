import { describe, expect, it, vi } from 'vitest';
import { Infographic } from '../../../src/runtime';

vi.mock('../../../src/editor', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../src/editor')>()),
  Editor: vi.fn().mockImplementation(() => ({ destroy: vi.fn() })),
}));

const SYNTAX = `infographic list-row-simple-horizontal-arrow
data
  title Steps
  lists
    - label Step 1
      desc Setup
    - label Step 2
      desc Ship`;

function renderEditable(direction: 'ltr' | 'rtl') {
  const infographic = new Infographic({
    container: document.createElement('div'),
    editable: true,
    direction,
  });
  const onWarning = vi.fn();
  infographic.on('warning', onWarning);
  infographic.render(SYNTAX);
  return onWarning;
}

describe('Infographic direction', () => {
  it('warns once when editing in RTL', () => {
    const onWarning = renderEditable('rtl');

    expect(onWarning).toHaveBeenCalledTimes(1);
    expect(onWarning).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('rtl') }),
    );
  });

  it('does not warn when editing in LTR', () => {
    expect(renderEditable('ltr')).not.toHaveBeenCalled();
  });
});
