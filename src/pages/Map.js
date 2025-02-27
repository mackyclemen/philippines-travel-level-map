import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import PhilippinesMapJSX from '../PhilippinesMapJSX';
import { PROVINCES, MENU_OPTIONS, PROVINCES_LENGTH } from '../utils/constants';
import '.././App.css';
import {
  levelArrayToString,
  levelStringToArray,
} from '../utils/levelConverter';

const PhilippinesMap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [provinceLevels, setProvinceLevels] = useState(
    new Array(PROVINCES_LENGTH).fill(0)
  );
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedProvinceName = useMemo(() => {
    return PROVINCES[selectedProvinceIndex]?.id ?? '';
  }, [selectedProvinceIndex]);

  const totalLevel = useMemo(() => {
    return provinceLevels.reduce((a, v) => a + v, 0);
  }, [provinceLevels]);

  const searchUrl =
    'http://www.google.com/search?q="' +
    selectedProvinceName +
    ', Philippines"';

  useEffect(() => {
    const levelStrFromURL = searchParams.get('levels');
    const levelArr = levelStringToArray(levelStrFromURL);
    setProvinceLevels(levelArr);
  }, []);

  useEffect(() => {
    const levelStr = levelArrayToString(provinceLevels);
    navigate(`/map?levels=${levelStr}`);
  }, [provinceLevels]);

  const handleLevelClick = useCallback(
    (event) => {
      const newLevel = event.target.getAttribute('level');

      const index = parseInt(selectedProvinceIndex);
      setProvinceLevels((prevProvinceLevels) => {
        const clonePrevLevels = [...prevProvinceLevels];
        clonePrevLevels[index] = parseInt(newLevel);
        return clonePrevLevels;
      });

      setMenuVisible(false);
    },
    [selectedProvinceIndex]
  );

  return (
    <div>
      <PhilippinesMapJSX
        provinceLevels={provinceLevels}
        setSelectedProvinceIndex={setSelectedProvinceIndex}
        setMenuPosition={setMenuPosition}
        setMenuVisible={setMenuVisible}
        totalLevel={totalLevel}
      />
      {menuVisible && (
        <div
          className='level-menu'
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
          }}>
          <div>
            <div className='menu-header' onClick={() => window.open(searchUrl)}>
              {selectedProvinceName} ↗{' '}
            </div>
            {MENU_OPTIONS.map(({ label, level }) => (
              <div
                key={level}
                level={level}
                className={`level-${level}`}
                onClick={handleLevelClick}>
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhilippinesMap;
