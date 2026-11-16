<?php

namespace App\Presenters;

use App\Models\Publisher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublisherPresenter
{
    public function index(LengthAwarePaginator $publishers, array $filters): Response
    {
        return Inertia::render('Publishers/Index', [
            'title' => 'Publishers',
            'items' => $publishers,
            'columns' => $this->columns(),
            'indexRoute' => 'publishers.index',
            'createRoute' => 'publishers.create',
            'showRoute' => 'publishers.show',
            'editRoute' => 'publishers.edit',
            'deleteRoute' => 'publishers.destroy',
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Publishers/Create', [
            'title' => 'Publisher',
            'indexRoute' => 'publishers.index',
            'storeRoute' => 'publishers.store',
            'fields' => $this->fields(),
        ]);
    }

    public function show(Publisher $publisher): Response
    {
        return Inertia::render('Publishers/Show', [
            'title' => 'Publisher',
            'item' => $publisher,
            'columns' => $this->columns(),
            'indexRoute' => 'publishers.index',
            'editRoute' => 'publishers.edit',
            'deleteRoute' => 'publishers.destroy',
        ]);
    }

    public function edit(Publisher $publisher): Response
    {
        return Inertia::render('Publishers/Edit', [
            'title' => 'Publisher',
            'indexRoute' => 'publishers.index',
            'storeRoute' => 'publishers.store',
            'updateRoute' => 'publishers.update',
            'recordId' => $publisher->id,
            'values' => $publisher->only('publisher_name'),
            'fields' => $this->fields(),
        ]);
    }

    public function created(): RedirectResponse
    {
        return $this->success('Publisher created successfully.');
    }

    public function updated(): RedirectResponse
    {
        return $this->success('Publisher updated successfully.');
    }

    public function deleted(): RedirectResponse
    {
        return $this->success('Publisher deleted successfully.');
    }

    public function deletionFailed(string $message): RedirectResponse
    {
        return back()->with('error', $message);
    }

    private function success(string $message): RedirectResponse
    {
        return redirect()
            ->route('publishers.index')
            ->with('success', $message);
    }

    private function columns(): array
    {
        return [['key' => 'publisher_name', 'label' => 'Publisher']];
    }

    private function fields(): array
    {
        return [['name' => 'publisher_name', 'label' => 'Publisher Name', 'required' => true]];
    }
}
