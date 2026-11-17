<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublisherRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Publisher;
use App\Services\PublisherService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublisherController extends Controller
{
    public function __construct(
        private PublisherService $publisherService
    ) {}

    public function index(SearchRequest $request): Response
    {
        return Inertia::render('Publishers/Index', [
            'title' => 'Publishers',
            'items' => $this->publisherService->getAll(
                search: $request->validated('search')
            ),
            'columns' => [['key' => 'publisher_name', 'label' => 'Publisher']],
            'filters' => $request->safe()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Publishers/Create', [
            'title' => 'Publisher',
            'resource' => 'publishers',
        ]);
    }

    public function store(PublisherRequest $request): RedirectResponse
    {
        $this->publisherService->create($request->validated());

        return to_route('publishers.index')->with('success', 'Publisher created successfully.');
    }

    public function show(Publisher $publisher): Response
    {
        return Inertia::render('Publishers/Show', [
            'title' => 'Publisher',
            'item' => $publisher,
            'columns' => [['key' => 'publisher_name', 'label' => 'Publisher']],
        ]);
    }

    public function edit(Publisher $publisher): Response
    {
        return Inertia::render('Publishers/Edit', [
            'title' => 'Publisher',
            'resource' => 'publishers',
            'recordId' => $publisher->id,
            'values' => $publisher->only('publisher_name'),
        ]);
    }

    public function update(PublisherRequest $request, Publisher $publisher): RedirectResponse
    {
        $this->publisherService->update($publisher, $request->validated());

        return to_route('publishers.index')->with('success', 'Publisher updated successfully.');
    }

    public function destroy(Publisher $publisher): RedirectResponse
    {
        try {
            $this->publisherService->delete($publisher);
        } catch (DomainException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('publishers.index')->with('success', 'Publisher deleted successfully.');
    }
}
