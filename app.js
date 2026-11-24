const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastText = document.getElementById('toastText');
let toastTimer;
function notify(title, text) {
  toastTitle.textContent = title;
  toastText.textContent = text;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3600);
}
document.getElementById('toastClose').addEventListener('click', () => toast.classList.remove('visible'));

const modalBackdrop = document.getElementById('modalBackdrop');
const campaignForm = document.getElementById('campaignForm');
function openCampaign() { modalBackdrop.classList.add('open'); document.body.style.overflow = 'hidden'; setTimeout(() => campaignForm.elements.name.focus(), 50); }
function closeCampaign() { modalBackdrop.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('createButton').addEventListener('click', openCampaign);
document.getElementById('modalClose').addEventListener('click', closeCampaign);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeCampaign(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCampaign(); });
campaignForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(campaignForm);
  const campaigns = JSON.parse(localStorage.getItem('limeCampaigns') || '[]');
  campaigns.push({ name: data.get('name'), goal: data.get('goal'), budget: Number(data.get('budget')), createdAt: new Date().toISOString() });
  localStorage.setItem('limeCampaigns', JSON.stringify(campaigns));
  closeCampaign();
  campaignForm.reset();
  notify('План кампании создан', 'Сохранено в черновиках — проверьте перед запуском.');
});

document.getElementById('reportButton').addEventListener('click', () => {
  const csv = '\uFEFFПоказатель,Значение\nОхват за месяц,48290\nПереходы,2846\nНовые подписчики,384\nСтоимость подписки,42.8';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'лайм-отчёт-ноябрь-2026.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  notify('Отчёт скачан', 'CSV-файл с ключевыми показателями готов.');
});
const periodButton = document.getElementById('periodButton');
periodButton.addEventListener('click', () => {
  const options = ['Последние 7 дней', 'Последние 30 дней', 'Последние 90 дней'];
  const next = (options.indexOf(periodButton.firstChild.textContent.trim()) + 1) % options.length;
  periodButton.firstChild.textContent = options[next] + ' ';
  notify('Период обновлён', `Выбран период: ${options[next].toLowerCase()}.`);
});
const navTitles = {overview:'Обзор',campaigns:'Кампании',content:'Контент-план',agents:'Команда агентов',analytics:'Аналитика',audience:'Аудитория',settings:'Настройки'};
document.querySelectorAll('.nav-item[data-page]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault();
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
  document.getElementById('crumbTitle').textContent = navTitles[link.dataset.page];
  if (link.dataset.page !== 'overview') notify(navTitles[link.dataset.page], 'Раздел входит в макет рабочего пространства.');
  else window.scrollTo({top:0, behavior:'smooth'});
}));
document.getElementById('agentsButton').addEventListener('click', () => notify('Команда агентов', 'Стратег, Креатор, Таргетолог и Аналитик готовы к работе.'));
document.getElementById('planButton').addEventListener('click', () => notify('План на месяц', 'Выполнено 72% задач. Следующая цель — 500 новых подписчиков.'));
['calendarButton','allActivityButton'].forEach(id => document.getElementById(id).addEventListener('click', () => notify('Контент-календарь', 'Сегодня запланировано 4 активности. Публикации требуют вашего одобрения.')));
document.querySelectorAll('.agent-menu,.dots-button,.more-button,.notification-button').forEach(el => el.addEventListener('click', () => notify('Настройки', 'В этой демоверсии внешние действия отключены.')));
