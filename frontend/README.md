This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/[...slug].tsx`. The page auto-updates as you edit the file.


# TODO : 
 - write some todos for payment sections.just search TODO to see them
## Project Routing

* public => including fonts and static images
* src => including all pages and components
* styles => including global styles


* src
* * components => components of reusing in project
* * * accordion-filter.tsx => category & city & section filter box => props : name ( filter box name ex: category) , title ( title of filter box that show in ui ) , active ( active filter that selected ) , isDefaultOpen ( set open or close filter box as default)
* * * add-blog => add single blog
* * * * components => components of add blog component
* * * * * upload-image 
* * * * * * AddBlogUploadImage.tsx =>  upload image for add single blog => props : blogEditData (single blog data same as edit ) , isEdit ( check form changed on edit or add) , setOpenModal ( open or close modal )
* * * * * upload-podcast
* * * * * * AddBlogUploadPodcast.tsx => upload podcast and sound for single blog => props: blogEditData ( single blog data ), isEdit ( check form changed on edit or add )
* * * * form => all forms for blogs
* * * * * innerAddBlogFormInfo.tsx => add blog form => props : props that comes from withFormik HOC
* * * * modal => all modals for blogs
* * * * * AddBlogModal.tsx => add blog modal => props : setOpenModal ( open or close modal ) , isEdit ( check form changed on edit or add ),editId ( edit blog id ),blogEditData ( blog data for edit ),setEditData ( check edited blog or not )
* * * add-property
* * * * components
* * * * * UploadGalleryImages.tsx => upload gallery images for add property 
* * * * * UploadPrimaryImages.tsx => upload primary image for add property => props : handleChange ( handle changes for upload image form)
* * * * forms => add property forms
* * * * * innerAddPropertyFormGallery.tsx => add property form UI for upload gallery  => props : that comes from withFormik
* * * * * innerAddProperyFormInfo.tsx => add property form UI for get meta , title etc of property from user => props : that comes from withFormik
* * * * property-options => options of single property
* * * * * Options.tsx => show all options of property => props : options ( options of property ),selectOptions ( selected options )
* * * add-ticket
* * * * form
* * * * * innerAddTicketForm.tsx => add ticket form ui => props : props that comes from withFormik
* * * * modal
* * * * * addTicketModal.tsx => add ticket modal that show add ticket form on it
* * * auth => authentication forms for user
* * * * innerAuthFormInfo.tsx => get fullname , role , real estate name from user forms UI => props : props that comes from withFormik
* * * * innerAuthFormPassword.tsx => form that get user password => props : props that comes from withFormik
* * * * innerAuthFormPhone.tsx => form that get phone number user => props : props that comes from withFormik
* * * * innerAuthFormVerify.tsx => form that get verify code from user that sent to user => props : props that comes from withFormik
* * * blog-card
* * * * blogCard.tsx => show blog data => props : data ( blog data ),delBlogModal ( set open or close blog modal for delete blog ),editable ( set editable to true or false for show edit icon),setDelBlogModal ( set open or close blog modal function),updateBlogModal ( set open or close update blog modal),setUpdateBlogModal ( set open or close update blog modal function),handleDeleteBlog ( function that delete single blog ),setBlogId ( set single blog id ),editId (blog id that clicked edit icon),setEditBlogId(set edit blog id),setEditBlogData (set edit blog data),blogEditData ( blog data for edit)
* * * blog-comments
* * * * BlogComments.tsx => show blog's comments => props  : articleId (id of article that have comments),user ( user comments)
* * * blog-row
* * * * BlogRow.tsx => show single blog row => props : data ( blog data ),delBlogModal ( set open or close blog modal for delete blog ),editable ( set editable to true or false for show edit icon),setDelBlogModal ( set open or close blog modal function),updateBlogModal ( set open or close update blog modal),setUpdateBlogModal ( set open or close update blog modal function),handleDeleteBlog ( function that delete single blog ),setBlogId ( set single blog id ),editId (blog id that clicked edit icon),setEditBlogId(set edit blog id),setEditBlogData (set edit blog data),blogEditData ( blog data for edit)
* * * blog-single-comment
* * * * BlogSingleComment => show single comment data  => props : comment (single comment),parentCommentName (parent comment name of single comment),parentCommentId(parent comment id of single comment),ref (refrence that point to last single comment element),articleId (article id that have comments),user( user data that leave single comment)
* * * breadcrumb
* * * * breadcrumb.tsx => create breadcrumb and show it => props : title (title of breadcrumb),subtitle(subtitle of breadcrumb that show under title),path (array of paths that user passed (breadcrumn paths))
* * * button
* * * * button.tsx => button component => props : loading (loading that show on button),title (title button),buttonClassName (class names of button),width ( button width ),bgColor ( background color of button )
* * * city-card
* * * * cityCard.tsx => show city name => props : city (city data)
* * * consultantCard
* * * * consultantCard.tsx => show consultant => props : data ( consultant data ), isRealState (check consultant is real estate or not)
* * * delete-blog-modal
* * * * DeleteBlogModal.tsx => delete blog modal => props : delBlogModal (state for delete blog modal that open or close modal),setDelBlogModal (set Delete blog modal function),handleDeleteBlog (delete blog function)
* * * delete-comment-modal
* * * * DeleteCommentModal.tsx => delete comment modal => props : delCommentModal (state for delete comment modal that open or close)
* * * divider
* * * * Divider.component.tsx => divider for saperate content section => props: title (title of divider as header),hasNavigation (show arrows),hasShowMore (show show more title in persian language),path (href of hasShowMore link button)
* * * empty-data
* * * * Emptydata.tsx => show no data found text when data is empty => props: title (title of component (not found text as example)),hasButton (if is true 1 button displayed),buttonTitle (title of button),Icon (icon that show in component),href (href of button link)
* * * estate-card
* * * * estateCard.tsx => show real estate data => props :data (real estate data),status (real estate status),ref (refrence of last element estate card),setOpenModal (set open or close modal),setAdvisorId (set advisor id)
* * * form
* * * * checkbox.tsx => custom checkbox => props : labelClassName (label classname ),name (name of checkbox element),value (value of checkbox),label (checkbox label),togglerClassName(toggler classname),spanClassName(spanClassname),checked (true or false  - checked or not),onClick (function invoked when click event happen)
* * * * input.tsx => custom input element => props : name (input name),type (input type),inputClassName(input classname for styles),errorClassName (error class names for styles errmessage component),labelClassName(label classname for style),placeholder (input placeholder),label (input label),showPass (show password or not ),handleChangeShowPass (change showPass state function),isPassword (input is password or not ),isTimer (input have timer or not),disabled (input disabled true or false),as (as textarea or etc),rows (when as set to textarea this rows can be set ),defaultValue (defaultValue of input),value (input value),required (input required true or false)
* * * layout-navbar
* * * * layoutNavbar.tsx => navbar of site => props : user (user data)
* * * list-property-filterbox
* * * * ListPropertyFilterBox.tsx => list property filter box that show at aside of page => props : setOpen (control open or close when show in mobile size)
* * * loading
* * * * loading.tsx => show loading => props : axis ( loading axis show ex : show in row or column )
* * * logout-modal 
* * * * logoutModal.tsx => when user click on logout button and modal displayed => props : logoutModal (state for logoutModal state),setLogoutModal (set open or close and control logoutModal state),handleLogout ( function for logout procces)
* * * multi-range-slider
* * * * multiRangeSlider.tsx => slider for price that displayed in filterbox => props : min (minimmum of slider),max (max of slider),onChange ( control and handle when value of slider changes)
* * * my-advisors-modal
* * * * myAdvisorModal.tsx => modal that displayed when user wanna accept or deny single advisor in myadvisor route in dashboard => props : setOpenModal (control modal open or close),openModal  : value (modal is open or close - true or false),type (delete or accept),advisorId (advisor id that user clicked on that card),setRefresh (refresh functions)
* * * my-properties-delete
* * * * myPropertyDeleteModal.tsx => displayed modal when user click on delete icon of single property => props : propertyId (property id that user clicked on it),setOpenModal (set open or close modal),handleDeleteMyProperties (handle delete single property)
* * * navigation-bar
* * * * navigationBar.tsx => displayed 2 arrows for slider => props : hasShowMore (display show more text or not),nextClass (class of next arrow of slider),prevClass (class of prev arrow of slider),path (href of show more link )
* * * order-row
* * * * orderRow.tsx => display order of user => props :data ( order data of user )
* * * package-row
* * * * packageRow.tsx => display package of user => props : rowOpen (open or close state),data (package data of user)
* * * password
* * * * innerPasswordForm.tsx => user password change in dashboard => props : props that comes from withFormik
* * * podcastplayer 
* * * * PodcastControl
* * * * * PodcastControl.tsx => functions and variables that control podcast player => props : playerState { isPlaying (podcast playing or not),progress (progress that passed),isMuted (player is muted or not),volume (volume of player),duration (duration of player),timePassed(time that passed and played)}
* * * * podcastPlayer
* * * * * PodcastPlayer.tsx =>  podcast player => props : src (src of that file wanna play)
* * * profile
* * * * innerProfilerForm.tsx => change profile picture form => props : props  that comes from withFormik
* * * property-card
* * * * PropertyCard.tsx => show and display single property data => props : wide (when is true , card show widely and with more width),data ( property data ),inMyFavorites (check property card wanna show in myFavorite route or not),inMyAds ( check property card wanna shw in MyAds route or not),setPropertyId (set id of that property),setOpenModal (set modal is open or close) , handleDeleteMyFavorites ( handle delete my favorites property)
* * * property-card-skeleton
* * * * propertyCardSkeleton.tsx => show skeleton card before data load => props : wide (wide card)
* * * property-map
* * * * propertyMap.tsx => show map 
* * * rating
* * * * Rating.tsx => stars rating component => props : count ( count of stars),rating ,color :{ filled (filled color) , unfilled (unfilled color)},onRating (handle Rating)
* * * reply-comment
* * * * ReplyComment.tsx => reply comment component when user wanna reply to single comment => props : comments (comments data),parentCommentId (id of parentComment),ref (refrence of last element of reply commnet),articleId (article id that have comment),user (user data)
* * * searchFilterBox
* * * * SearchFilterBox.tsx => filter box of search field => props : setOpen (set open or close filter box)
* * * select
* * * * CustomSelect.tsx => custom react select => props : handleChange (handle react select value when changes),options (options that embed in react select options),value (react select value),name (select name),hasLabel (has label or not),title (title of react select),placeholder (input placeholder in react select),loading (loading displays when data wanna load),defaultValue (defaul value of input in react select),clear (clear input value),isDisable (is disabled input or not),isRtl (right to left or not),required (input required),titleClassName (title calssess)
* * * show-more
* * * * ShowMore.tsx => show more  => props : hasArrowRight (display arrow right or not),hasArrowLeft (display arrow left or not),title (title of show more ),fontSize (show more title font size),fontWeight (show more title font weight),fontColor (show mote title font color),path (href of show more link)
* * * similar-properties-list
* * * * mobile
* * * * * MobileSimilarPropertiesList.tsx => show list of similar properties in mobile size => props : children (react node that wanna show in parent element),data (properties data),prevClass (prev arrow class),nextClass(next arrow class)
* * * * SimilarPropertiesList.tsx => show list of similar properties in normal size => props : data (properties data)
* * * single-property-detail
* * * * SinglePropertyDetail => display detail of single property => props : data ( single property data ),inDashboard ( show single property in dashboard or other ),activePosts (active properties )
* * * stepper
* * * * stepper.tsx => stepper that show in add property form and page => props : steps (steps of stepper),activeStep(what step is active),dir (direction of stepper),clickable (clickable or not)
* * * statistics
* * * * Statistics.tsx => show chart and statistics => props : title (title of statistics),titleSvg (title of svg),statisticsNumber (number statistics),statisticsTitle (title of statitics)
* * * svg => all svg components
* * * ticket-card
* * * * ticketCard.tsx => show ticket data in card => props : data (ticket data),isActive (ticket card is active and clicked or not),handleClick  (handle function when click evnet happen)
* * * ticket-chat-box
* * * * ticketChatBox.tsx => chat box of single ticket that show content of ticket => props : ticketId (id of ticket that wanna display),adminBox (admin side or user side)
* * * ticket-row
* * * * main => ticket row in desktop size
* * * * * ticketRow => show single ticket as row => props : data (ticket data),urgencies (urgencies of ticket),department (department of single ticket)
* * * * mobile => ticket row in mobile size
* * * * * ticketRowMobile.tsx => show single ticket as row just in mobile size => props : data (ticket data)
* * * tinyLoading
* * * * tinyLoading.tsx => display tiny and small loading
* * * vip-modal
* * * * vipModal.tsx => show vip modal => props : setVipModal (set open or close modal for vip section),vipModal (open or close - true or false),handleNotifToMe (handle notif to user )
* * configs
* * * metaTranslate.tsx => translate the metas to persian
* * forms => including forms logics
* * * add-blog => form that add new blog
* * * add-property => form that add new ad property
* * * add-ticket => form that add new ticket
* * * add-password => form that send password for login/register
* * * add-profile => form that create a profile for user in dashboard
* hooks
* * useAdvisorsByStatus.tsx => get advisor => props : page number , queries(query parameters)
    ,status(status of advisors),limit(limit of pagination),refresh(refresh the api)
* * useArticles.tsx => get articles => props : page(page number) , queries(query params)
    ,limit(limit pagination)
* * useAuth.tsx => get user data
* * useCategories.tsx => get Categories
* * useCategoriesByCity.tsx => get Categories by city => props : value (city_id)
* * useCities.tsx => get cities
* * useCitiesByCategory.tsx => get Cities by category => props : value(category id)
* * useCompanies.tsx => get Companies => props: status (active company status)
* * useDebounce.tsx => call api delay => props : value (search keyword) , delay (search delay)
* * useMyFavorites.tsx => get favorites properties => props : page (page number) , queries (search query),limit(number of posts)
* * useMyProperties.tsx => get user's properties => props : page (page number) , queries (search query),limit(number of posts)
* * useOptions.tsx => get all options of property
* * useOptionss.tsx => get all options of property by category => props : category (category id)
* * useOrders.tsx => get all orders
* * useProperties.tsx => get all properties => props : page (page number) , queries (search query),limit(number of posts)
* * useProperty.tsx => get single Property => props : id (property id)
* * useRedux.tsx => use redux
* * useSections.tsx => get all sections by city => props : city (city id)
* layouts
* * dashboardLayout => layout of all dashboard pages
* * mainLayout => main layout of project
* * * filterBox.tsx => the filter is in landing page
* * * footer.tsx => the footer of main layout
* * * header.tsx
* * * mobileHeader.tsx
* * * mobileSearchHeader.tsx
* * * searchHeader.tsx
* pages
* * city => dynamic page based on city
* * * category => dynamic page based on category
* * * * section => dynamic page based on section
* * about-us
* * add-property => forms that use in add an ad property is in the page
* * auth => login / register page
* * best-advisor
* * best-realtor
* * blog- list
* * consultant
* * * user => dynamic page based on user id
* * contact-us
* * packages => packages page that user can buy
* * search => search properties page
* * single-blog
* * * id => dynamic page based on blog id
* * single-property => dynamic page based on property id
* * verify => page that show the payment is success or failed
* * vip => show vip posts in this page
* * 404
* * 400
* * dashboard => user dashboard
* * * change-rol => user can change role in this page
* * * my-advisors => the real estates advisors in this page
* * * my-favourites => posts that user bookmarked are in here
* * * my-profile => user Profile page
* * * my-properties => user can see ads that posted in site are there
* * * orders => orders that user submited is in here
* * * password => user can set or change login password in this page
* * * tickets => send ticket page
* * panel => admin panel pages
* * * blog => admin can add edit or delete blogs in here
* * * ticket => admin can see and answer tickets from here
* * redux
* * * store => the global store of project
* * * slices
* * * * addPropertySlice.tsx
* * * * authSlice.tsx
* * * * blogSlice.tsx
* * * * commentSlice.tsx
* * * * formSlice.tsx
* * * * propertiesSlice.tsx
* * * * ticketSlice.tsx
* * * * userSlice.tsx
* * services => requests services are here
* * * api => api of project based on entities
* * * * advisor.tsx
* * * * article.tsx
* * * * comment.tsx
* * * * dashboard.tsx
* * * * packages.tsx
* * * * password.tsx
* * * * profile.tsx
* * * * property.tsx
* * * * rating.tsx
* * * axiosInstances
* * * * privateAxios.tsx => requests that need token
* * * * publicAxios.tsx => requests that does not need token
* * utils => the global functions used in project
* * * formatPhone.tsx => set # between of phone number => props=> phone number
* * * numberWithCommas.tsx => set thousend seperatore on number => props => number
* * * scrollToTop.tsx => scrolling to top based on route change
* * * textEllipsis.tsx => props=> text(string) and count(counter of ellipsis)
* * * toEnglishDigitForPhone.tsx => props => number
* * * wordifyfa => change number to persian letter=> props=> input(number) 
