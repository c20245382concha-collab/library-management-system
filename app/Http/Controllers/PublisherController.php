<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublisherRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Publisher;
use App\Presenters\PublisherPresenter;
use App\Services\PublisherService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class PublisherController extends Controller
{
    public function __construct(
        private PublisherService $publisherService,
        private PublisherPresenter $presenter
    ) {}

    public function index(SearchRequest $request): Response
    {
        $publishers = $this->publisherService->getAll(
            search: $request->validated('search')
        );

        return $this->presenter->index($publishers, $request->safe()->only('search'));
    }

    public function create(): Response
    {
        return $this->presenter->create();
    }

    public function store(
        PublisherRequest $request
    ): RedirectResponse {
        $this->publisherService->create($request->validated());

        return $this->presenter->created();
    }

    public function show(Publisher $publisher): Response
    {
        return $this->presenter->show($publisher);
    }

    public function edit(Publisher $publisher): Response
    {
        return $this->presenter->edit($publisher);
    }

    public function update(
        PublisherRequest $request,
        Publisher $publisher
    ): RedirectResponse {
        $this->publisherService->update(
            $publisher,
            $request->validated()
        );

        return $this->presenter->updated();
    }

    public function destroy(Publisher $publisher): RedirectResponse
    {
        try {
            $this->publisherService->delete($publisher);
        } catch (DomainException $exception) {
            return $this->presenter->deletionFailed($exception->getMessage());
        }

        return $this->presenter->deleted();
    }
}
