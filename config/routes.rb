Rails.application.routes.draw do
  resources :sites do
    get :update_scrape
    resources :listings
  end

  resources :regions do
    resources :boats
  end

  resources :histories

  resources :listings do
    resources :histories
  end

  resources :boats do
    get :stats
    get :update_location_data
    resources :listings
    resources :regions
    get :images
  end

  resources :regions do
    resources :boats
  end
end
