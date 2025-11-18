import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/gooeyNav.css';

const GooeyNav = ({
  items = [],
  animationTime = 300,
  initialActiveIndex = 0
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const normalizePath = (p) => {
    if (!p) return '/';
    try {
      let s = String(p).toLowerCase();
      if (!s.startsWith('/')) s = '/' + s;
      if (s === '/') return '/';
      return s.replace(/\/+$/, '');
    } catch {
      return '/';
    }
  };

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

  const animateEffectOnElement = (liEl) => {
    if (!liEl) return;
    updateEffectPosition(liEl);
    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
  };

  const handleClick = (liEl, index, href) => {
    const hrefNorm = normalizePath(href);
    if (activeIndex !== index) {
      setActiveIndex(index);
      animateEffectOnElement(liEl);
    } else {
      animateEffectOnElement(liEl);
    }
    if (href) {
      navigate(hrefNorm);
    }
  };

  const handleKeyDown = (e, liEl, index, href) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(liEl, index, href);
    }
  };

  useEffect(() => {
    if (!items || items.length === 0) return;
    const pathname = normalizePath(location.pathname || '/');

    const foundIndex = items.findIndex(it => {
      const href = it.href ?? '#';
      return href && normalizePath(href) === pathname;
    });

    const newIndex = foundIndex >= 0 ? foundIndex : initialActiveIndex;

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    } else {
      const activeLi = navRef.current?.querySelectorAll('li')[newIndex];
      if (activeLi) updateEffectPosition(activeLi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, items, initialActiveIndex]);

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = activeIndex >= 0 ? navRef.current.querySelectorAll('li')[activeIndex] : null;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    } else {
      if (filterRef.current) filterRef.current.style.width = '0px';
      if (textRef.current) {
        textRef.current.style.width = '0px';
        textRef.current.innerText = '';
        textRef.current.classList.remove('active');
      }
    }

    const ro = new ResizeObserver(() => {
      const currentActiveLi = activeIndex >= 0 ? navRef.current?.querySelectorAll('li')[activeIndex] : null;
      if (currentActiveLi) updateEffectPosition(currentActiveLi);
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef} role="navigation" aria-label="Main">
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => {
            const href = item.href ?? '#';
            return (
              <li
                key={index}
                className={activeIndex === index ? 'active' : ''}
                tabIndex={0}
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
