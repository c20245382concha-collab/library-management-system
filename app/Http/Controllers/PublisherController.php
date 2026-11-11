<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublisherRequest;
use App\Models\Publisher;
use App\Services\PublisherService;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublisherController extends Controller
{
    public function __construct(
        private PublisherService $publisherService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Resources/Index', [
            'title' => 'Publishers',
            'items' => $this->publisherService->getAll(
                search: request('search')
            ),
            'columns' => [['key' => 'publisher_name', 'label' => 'Publisher']],
            'indexRoute' => 'publishers.index',
            'createRoute' => 'publishers.create',
            'showRoute' => 'publishers.show',
            'editRoute' => 'publishers.edit',
            'deleteRoute' => 'publishers.destroy',
            'filters' => request()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Publisher',
            'indexRoute' => 'publishers.index',
            'storeRoute' => 'publishers.store',
            'fields' => [['name' => 'publisher_name', 'label' => 'Publisher Name', 'required' => true]],
        ]);
    }

    public function store(
        PublisherRequest $request
    ): RedirectResponse {
        $this->publisherService->create($request->validated());

        return redirect()
            ->route('publishers.index')
            ->with('success', 'Publisher created successfully.');
    }

    public function show(Publisher $publisher): Response
    {
        return Inertia::render('Resources/Show', [
            'title' => 'Publisher',
            'item' => $publisher,
            'columns' => [['key' => 'publisher_name', 'label' => 'Publisher']],
            'indexRoute' => 'publishers.index',
            'editRoute' => 'publishers.edit',
            'deleteRoute' => 'publishers.destroy',
        ]);
    }

    public function edit(Publisher $publisher): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Publisher',
            'indexRoute' => 'publishers.index',
            'storeRoute' => 'publishers.store',
            'updateRoute' => 'publishers.update',
            'recordId' => $publisher->id,
            'values' => $publisher->only('publisher_name'),
            'fields' => [['name' => 'publisher_name', 'label' => 'Publisher Name', 'required' => true]],
        ]);
    }

    public function update(
        PublisherRequest $request,
        Publisher $publisher
    ): RedirectResponse {
        $this->publisherService->update(
            $publisher,
            $request->validated()
        );

        return redirect()
            ->route('publishers.index')
            ->with('success', 'Publisher updated successfully.');
    }

    public function destroy(Publisher $publisher): RedirectResponse
    {
        try {
            $this->publisherService->delete($publisher);
        } catch (QueryException $exception) {
            if (!str_starts_with((string) $exception->getCode(), '23')) {
                throw $exception;
            }

            return back()->with('error', 'This publisher cannot be deleted while books are linked to them.');
        }

        return redirect()
            ->route('publishers.index')
            ->with('success', 'Publisher deleted successfully.');
    }
}
