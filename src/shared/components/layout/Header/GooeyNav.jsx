import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/gooeyNav.css';


const GooeyNav = ({
  items = [],
  onLogin = () => {},
  animationTime = 600,
  initialActiveIndex = 0
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  // Update effect position helper
  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current || !element) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  // When user clicks a nav item: animate + navigate
  const handleClick = (liEl, index, href) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (textRef.current) {
      textRef.current.classList.remove('active');
      // force reflow to restart animation
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (href) navigate(href);
  };

  // keyboard activation (Enter / Space)
  const handleKeyDown = (e, liEl, index, href) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(liEl, index, href);
    }
  };

  // Sync activeIndex with current location.pathname.
  // Match exactly: item.href must equal pathname (no startsWith).
  useEffect(() => {
    if (!items || items.length === 0) return;
    const pathname = location.pathname || '/';

    // find the first item whose href exactly equals pathname
    // If none found, fall back to initialActiveIndex (or -1 to no selection)
    const foundIndex = items.findIndex(it => {
      // Normalize: ensure both end with no trailing slash except root
      const normalize = p => (p === '/' ? '/' : p.replace(/\/+$/, ''));
      const href = it.href ?? '#';
      return href && normalize(href) === normalize(pathname);
    });

    const newIndex = foundIndex >= 0 ? foundIndex : -1;

    // If same as current activeIndex, still ensure effect is placed on matching element.
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    } else {
      // place effect even if index didn't change (e.g., direct refresh on same route)
      const activeLi = navRef.current?.querySelectorAll('li')[newIndex];
      if (activeLi) updateEffectPosition(activeLi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, items]);

  // On mount and resize, ensure the effect aligns to the active item (if any)
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = activeIndex >= 0 ? navRef.current.querySelectorAll('li')[activeIndex] : null;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    } else {
      // Hide the effect when nothing is active
      if (filterRef.current) filterRef.current.style.width = '0px';
      if (textRef.current) {
        textRef.current.style.width = '0px';
        textRef.current.innerText = '';
        textRef.current.classList.remove('active');
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = activeIndex >= 0 ? navRef.current?.querySelectorAll('li')[activeIndex] : null;
      if (currentActiveLi) updateEffectPosition(currentActiveLi);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef} role="navigation" aria-label="Main">
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => {
            // Ensure we treat missing hrefs safely
            const href = item.href ?? '#';
            return (
              <li
                key={index}
                className={activeIndex === index ? 'active' : ''}
                // make li focusable for keyboard users
                tabIndex={-1}
                aria-current={activeIndex === index ? 'page' : undefined}
              >
                <a
                  href={href}
                  onClick={e => {
                    e.preventDefault();
                    const liEl = e.currentTarget.parentElement;
                    if (liEl) handleClick(liEl, index, href);
                  }}
                  onKeyDown={e => {
                    const liEl = e.currentTarget.parentElement;
                    if (liEl) handleKeyDown(e, liEl, index, href);
                  }}
                  // allow anchor to be focusable
                  tabIndex={0}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <span className="effect filter" ref={filterRef} aria-hidden />
      <span className="effect text" ref={textRef} aria-hidden />
    </div>
  );
};

export default GooeyNav;