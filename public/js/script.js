(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  const filterButtons = document.querySelectorAll('.filter');
  const listingCards = document.querySelectorAll('[data-category]');
  const switchInput = document.querySelector('.switch input');
  const mutedTexts = document.querySelectorAll('.text-muted');


  const applyFilter = category => {
    listingCards.forEach(card => {
      if (!category || category === 'all' || card.dataset.category === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      const isActive = button.classList.contains('active');

      filterButtons.forEach(btn => btn.classList.remove('active'));

      if (isActive) {
        applyFilter(null);
      } else {
        button.classList.add('active');
        applyFilter(category);
      }
    });
  });

  if (switchInput) {
    switchInput.addEventListener('change', e => {
      mutedTexts.forEach(element => {
        element.style.display = e.target.checked ? 'inline' : 'none';
        element.previousElementSibling.style.textDecoration = e.target.checked ? 'line-through' : 'none';
      });
    });
  }
})();

searchListings = () => {
  const searchInput = document.querySelector('.searchBar input').value.toLowerCase();
  const listingCards = document.querySelectorAll('[name]');
 if(searchInput.trim() === '') {
  listingCards.forEach(card => {
card.style.display = '';
  })
 }else if(searchInput.length>0){
  listingCards.forEach(card =>{
    let name=card.name.trim().toLowerCase().replaceAll(' ', '');
    let searchData=searchInput.trim().toLowerCase().replaceAll(' ', '');
    let x=(name.includes(searchData));
   if(x){
    card.style.display="";
   }else{
    card.style.display="none";
   }
  })
 }

}
