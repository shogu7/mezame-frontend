import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/gooeyNav.css';

const GooeyNav = ({
  items = [],
  animationTime = 300,
  initialActiveIndex = 0,
  onItemClick
}) => {
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
    
    // Calcul des styles avec centrage Flexbox pour le texte flottant
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
      display: 'flex',            // Ajout pour centrage parfait
      alignItems: 'center',       // Ajout pour centrage parfait
      justifyContent: 'center'    // Ajout pour centrage parfait
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
      // Force reflow
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
  };

  const handleClick = (liEl, index, href) => {
    animateEffectOnElement(liEl);
    setActiveIndex(index);
    if (onItemClick) {
      onItemClick(href);
    }
  };

  const handleKeyDown = (e, liEl, index, href) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(liEl, index, href);
    }
  };

  // Synchronisation avec l'URL (React Router)
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    const pathname = normalizePath(location.pathname || '/');
    
    let foundIndex = items.findIndex(it => {
      const itemPath = normalizePath(it.href ?? '#');
      if (itemPath === pathname) return true;
      if (itemPath !== '/' && pathname.startsWith(itemPath + '/')) return true;
      
      const pathParts = pathname.split('/').filter(Boolean);
      const itemParts = itemPath.split('/').filter(Boolean);
      if (pathParts.length === 2 && itemParts.length === 2) {
        return pathParts[0] === itemParts[0];
      }
      return false;
    });

    // Si on ne trouve pas (ex: page 404 ou route inconnue), on garde l'ancien ou on désélectionne
    // Ici on garde foundIndex si >= 0, sinon on check si activeIndex est valide, sinon initial
    const newIndex = foundIndex >= 0 ? foundIndex : -1;

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
    
    // Force la mise à jour visuelle même si l'index est le même (pour le redimensionnement initial)
    const targetIndex = newIndex >= 0 ? newIndex : activeIndex;
    if (targetIndex >= 0) {
       const activeLi = navRef.current?.querySelectorAll('li')[targetIndex];
       if (activeLi) updateEffectPosition(activeLi);
    }

  }, [location.pathname, items, initialActiveIndex]);

  // Gestion de l'animation et de la visibilité de la "bulle"
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    
    const activeLi = activeIndex >= 0 ? navRef.current.querySelectorAll('li')[activeIndex] : null;
    
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
      filterRef.current.style.opacity = '1';
    } else {
      // Si aucun élément actif (ex: chargement ou route hors menu)
      if (filterRef.current) {
         filterRef.current.style.opacity = '0';
         filterRef.current.style.width = '0px';
      }
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
  }, [activeIndex, items]);

  return (
    <div className="nav-wrapper-center">
        <div className="gooey-nav-container" ref={containerRef} role="navigation" aria-label="Main">
        <nav>
            <ul ref={navRef}>
            {items.map((item, index) => {
                const href = item.href ?? '#';
                const isActive = activeIndex === index;
                
                // Gestion spéciale pour le bouton logout qui peut être stylisé différemment
                const isLogout = href === '/logout';

                return (
                <li
                    key={`${index}-${href}`}
                    className={`${isActive ? 'active' : ''} ${isLogout ? 'logout-item' : ''}`}
                    tabIndex={0}
                    aria-current={isActive ? 'page' : undefined}
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
                    tabIndex={-1}
                    >
                    {item.label}
                    </a>
                </li>
                );
            })}
            </ul>
        </nav>

        <span className="effect filter" ref={filterRef} aria-hidden="true" />
        <span className="effect text" ref={textRef} aria-hidden="true" />
        </div>
    </div>
  );
};

export default GooeyNav;