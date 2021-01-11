function openTab(event: Event, selectedTabId: string, selectedTabLinkId: string) {
  const tabs = document.getElementsByClassName('parameters') as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < tabs.length; i++) {
    const isSelectedTab = tabs[i].id === selectedTabId;
    tabs[i].style.display = isSelectedTab ? 'block' : 'none';
  }

  const tabLinks = document.getElementsByClassName('tablinks') as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < tabLinks.length; i++) {
    const isSelectedTabLink = tabLinks[i].id === selectedTabLinkId;
    if (isSelectedTabLink) {
      tabLinks[i].classList.add('active');
    } else {
      tabLinks[i].classList.remove('active');
    }
  }
}